import {
  CreateMLCEngine,
  Engine,
} from '@mlc-ai/web-llm';
import { APIClient } from './apiClient';

export interface AIEngineConfig {
  modelId: string;
  apiKey?: string;
  provider?: string;
  endpoint?: string;
}

class AIEngine {
  private engine: Engine | null = null;
  private apiClient: APIClient | null = null;
  private currentConfig: AIEngineConfig | null = null;
  private isLoading = false;
  private progressCallback?: (progress: any) => void;

  async initialize(
    config: AIEngineConfig,
    onProgress?: (progress: any) => void
  ) {
    this.currentConfig = config;
    this.isLoading = true;
    this.progressCallback = onProgress;

    try {
      // For local models using WebLLM
      if (config.provider !== 'api' && config.provider !== 'openai' && config.provider !== 'anthropic' && config.provider !== 'gemini' && config.provider !== 'groq') {
        console.log(`[v0] Initializing WebLLM with model: ${config.modelId}`);
        
        this.engine = await CreateMLCEngine(config.modelId, {
          initProgressCallback: (info: any) => {
            console.log(`[WebLLM] ${info.text}`);
            this.progressCallback?.(info);
          },
        });
        
        console.log('[v0] WebLLM engine initialized successfully');
      } else if (config.provider && config.apiKey) {
        // For API-based models
        console.log(`[v0] Initializing ${config.provider} API client`);
        this.apiClient = new APIClient(config.provider, config.apiKey);
        console.log('[v0] API client initialized successfully');
      }
    } catch (error) {
      console.error('[v0] Failed to initialize:', error);
      this.isLoading = false;
      throw error;
    }

    this.isLoading = false;
  }

  async chat(
    messages: Array<{ role: string; content: string }>,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.engine && !this.apiClient) {
      throw new Error('AI Engine not initialized');
    }

    try {
      // Local model chat with WebLLM
      if (this.engine) {
        let response = '';

        console.log('[v0] Starting chat with WebLLM model');
        
        const asyncFunc = this.engine.chat.asChatCompletion();
        const stream = await asyncFunc({
          messages: messages as any,
          stream: true,
        });

        for await (const chunk of stream) {
          if (
            chunk.choices &&
            chunk.choices[0]?.delta?.content
          ) {
            const content = chunk.choices[0].delta.content;
            response += content;
            onChunk?.(content);
          }
        }

        console.log('[v0] Chat response completed');
        return response;
      }

      // API-based models
      if (this.apiClient && this.currentConfig) {
        console.log(`[v0] Starting chat with ${this.currentConfig.provider} API`);
        const response = await this.apiClient.chat(
          messages,
          this.currentConfig.modelId,
          onChunk
        );
        return response;
      }

      throw new Error('No valid AI engine available');
    } catch (error) {
      console.error('[v0] Chat error:', error);
      throw error;
    }
  }

  async unload() {
    if (this.engine) {
      console.log('[v0] Unloading WebLLM engine');
      await this.engine.terminate();
      this.engine = null;
    }
    this.apiClient = null;
  }

  isReady(): boolean {
    return !this.isLoading && (this.engine !== null || this.apiClient !== null);
  }

  getLoadingProgress(): number {
    return this.isLoading ? 50 : 100;
  }
}

export const aiEngine = new AIEngine();
