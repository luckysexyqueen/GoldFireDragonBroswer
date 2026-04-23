export interface APIProvider {
  name: string;
  baseURL: string;
  modelNames: string[];
  requiresAuth: boolean;
}

export const SUPPORTED_PROVIDERS: Record<string, APIProvider> = {
  openai: {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    modelNames: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    requiresAuth: true,
  },
  anthropic: {
    name: 'Anthropic',
    baseURL: 'https://api.anthropic.com/v1',
    modelNames: ['claude-opus-4.1', 'claude-sonnet-4', 'claude-haiku'],
    requiresAuth: true,
  },
  gemini: {
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    modelNames: ['gemini-3-flash', 'gemini-3-pro', 'gemini-2-flash'],
    requiresAuth: true,
  },
  groq: {
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    modelNames: ['mixtral-8x7b-32768', 'llama-2-70b-4096'],
    requiresAuth: true,
  },
};

export class APIClient {
  private apiKey: string;
  private provider: string;
  private baseURL: string;

  constructor(provider: string, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.baseURL = SUPPORTED_PROVIDERS[provider]?.baseURL || '';
  }

  async chat(
    messages: Array<{ role: string; content: string }>,
    model: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      switch (this.provider) {
        case 'openai':
          return await this.openaiChat(messages, model, onChunk);
        case 'anthropic':
          return await this.anthropicChat(messages, model, onChunk);
        case 'gemini':
          return await this.geminiChat(messages, model, onChunk);
        case 'groq':
          return await this.groqChat(messages, model, onChunk);
        default:
          throw new Error(`Unsupported provider: ${this.provider}`);
      }
    } catch (error) {
      console.error(`[v0] ${this.provider} API error:`, error);
      throw error;
    }
  }

  private async openaiChat(
    messages: Array<{ role: string; content: string }>,
    model: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return await this.handleStreamResponse(response, onChunk);
  }

  private async anthropicChat(
    messages: Array<{ role: string; content: string }>,
    model: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    return await this.handleAnthropicStream(response, onChunk);
  }

  private async geminiChat(
    messages: Array<{ role: string; content: string }>,
    model: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    // Convert messages to Gemini format
    const contents = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `${this.baseURL}/models/${model}:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    return await this.handleGeminiStream(response, onChunk);
  }

  private async groqChat(
    messages: Array<{ role: string; content: string }>,
    model: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    return await this.handleStreamResponse(response, onChunk);
  }

  private async handleStreamResponse(
    response: Response,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              onChunk?.(content);
            }
          } catch (e) {
            // Skip parsing errors
          }
        }
      }
    }

    return fullText;
  }

  private async handleAnthropicStream(
    response: Response,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (
              data.type === 'content_block_delta' &&
              data.delta?.type === 'text_delta'
            ) {
              const content = data.delta.text;
              fullText += content;
              onChunk?.(content);
            }
          } catch (e) {
            // Skip parsing errors
          }
        }
      }
    }

    return fullText;
  }

  private async handleGeminiStream(
    response: Response,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              fullText += content;
              onChunk?.(content);
            }
          } catch (e) {
            // Skip parsing errors
          }
        }
      }
    }

    return fullText;
  }
}
