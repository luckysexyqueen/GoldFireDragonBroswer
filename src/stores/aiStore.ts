import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// AI Model Types
export interface AIModel {
  id: string;
  name: string;
  provider: 'ollama' | 'lmstudio' | 'groq' | 'together' | 'huggingface' | 'openrouter' | 'custom';
  type: 'local' | 'online';
  endpoint?: string;
  apiKey?: string;
  modelId?: string;
  enabled: boolean;
  description?: string;
}

// Prompt Template
export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: 'system' | 'user' | 'assistant';
  isDefault?: boolean;
}

// MCP Server Config
export interface MCPServer {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  description?: string;
  tools?: string[];
}

// AI Settings
export interface AISettings {
  // General
  defaultModel: string | null;
  streamingEnabled: boolean;
  autoSaveChats: boolean;
  maxTokens: number;
  temperature: number;
  
  // Assistant
  systemPrompt: string;
  assistantName: string;
  voiceEnabled: boolean;
  
  // Local AI
  ollamaEndpoint: string;
  lmStudioEndpoint: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  modelId?: string;
}

// Chat Session
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  modelId?: string;
}

interface AIStore {
  // Models
  models: AIModel[];
  addModel: (model: AIModel) => void;
  updateModel: (id: string, updates: Partial<AIModel>) => void;
  removeModel: (id: string) => void;
  toggleModel: (id: string) => void;
  
  // Prompts
  prompts: PromptTemplate[];
  addPrompt: (prompt: PromptTemplate) => void;
  updatePrompt: (id: string, updates: Partial<PromptTemplate>) => void;
  removePrompt: (id: string) => void;
  
  // MCP Servers
  mcpServers: MCPServer[];
  addMCPServer: (server: MCPServer) => void;
  updateMCPServer: (id: string, updates: Partial<MCPServer>) => void;
  removeMCPServer: (id: string) => void;
  toggleMCPServer: (id: string) => void;
  
  // Settings
  settings: AISettings;
  updateSettings: (updates: Partial<AISettings>) => void;
  
  // Chat Sessions
  sessions: ChatSession[];
  currentSessionId: string | null;
  createSession: () => string;
  deleteSession: (id: string) => void;
  setCurrentSession: (id: string | null) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearSession: (id: string) => void;
}

// Default models (free/unlimited)
const defaultModels: AIModel[] = [
  {
    id: 'ollama-default',
    name: 'Ollama (Local)',
    provider: 'ollama',
    type: 'local',
    endpoint: 'http://localhost:11434',
    enabled: false,
    description: 'Run AI models locally with Ollama'
  },
  {
    id: 'lmstudio-default',
    name: 'LM Studio (Local)',
    provider: 'lmstudio',
    type: 'local',
    endpoint: 'http://localhost:1234/v1',
    enabled: false,
    description: 'Run AI models locally with LM Studio'
  },
  {
    id: 'groq-free',
    name: 'Groq (Free Tier)',
    provider: 'groq',
    type: 'online',
    endpoint: 'https://api.groq.com/openai/v1',
    modelId: 'llama-3.3-70b-versatile',
    enabled: false,
    description: 'Fast inference with Groq - Free tier available'
  },
  {
    id: 'together-free',
    name: 'Together AI (Free)',
    provider: 'together',
    type: 'online',
    endpoint: 'https://api.together.xyz/v1',
    modelId: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    enabled: false,
    description: 'Together AI - Free models available'
  },
  {
    id: 'huggingface-free',
    name: 'HuggingFace (Free)',
    provider: 'huggingface',
    type: 'online',
    endpoint: 'https://api-inference.huggingface.co/models',
    modelId: 'meta-llama/Llama-3.2-3B-Instruct',
    enabled: false,
    description: 'HuggingFace Inference API - Free tier'
  },
  {
    id: 'openrouter-free',
    name: 'OpenRouter (Free)',
    provider: 'openrouter',
    type: 'online',
    endpoint: 'https://openrouter.ai/api/v1',
    modelId: 'meta-llama/llama-3.2-3b-instruct:free',
    enabled: false,
    description: 'OpenRouter - Many free models available'
  }
];

// Default prompts
const defaultPrompts: PromptTemplate[] = [
  {
    id: 'default-system',
    name: 'Default Assistant',
    content: 'You are a helpful AI assistant. Answer questions accurately and concisely.',
    category: 'system',
    isDefault: true
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    content: 'You are a creative writing assistant. Help users with stories, poems, and creative content.',
    category: 'system'
  },
  {
    id: 'code-helper',
    name: 'Code Helper',
    content: 'You are an expert programmer. Help users write, debug, and understand code.',
    category: 'system'
  },
  {
    id: 'translator',
    name: 'Translator',
    content: 'You are a professional translator. Translate text between languages accurately while preserving meaning and tone.',
    category: 'system'
  }
];

// Default settings
const defaultSettings: AISettings = {
  defaultModel: null,
  streamingEnabled: true,
  autoSaveChats: true,
  maxTokens: 2048,
  temperature: 0.7,
  systemPrompt: 'You are a helpful AI assistant.',
  assistantName: 'AI Assistant',
  voiceEnabled: false,
  ollamaEndpoint: 'http://localhost:11434',
  lmStudioEndpoint: 'http://localhost:1234/v1'
};

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      // Models
      models: defaultModels,
      addModel: (model) => set((state) => ({ models: [...state.models, model] })),
      updateModel: (id, updates) => set((state) => ({
        models: state.models.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
      removeModel: (id) => set((state) => ({
        models: state.models.filter((m) => m.id !== id)
      })),
      toggleModel: (id) => set((state) => ({
        models: state.models.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m)
      })),
      
      // Prompts
      prompts: defaultPrompts,
      addPrompt: (prompt) => set((state) => ({ prompts: [...state.prompts, prompt] })),
      updatePrompt: (id, updates) => set((state) => ({
        prompts: state.prompts.map((p) => p.id === id ? { ...p, ...updates } : p)
      })),
      removePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id)
      })),
      
      // MCP Servers
      mcpServers: [],
      addMCPServer: (server) => set((state) => ({ mcpServers: [...state.mcpServers, server] })),
      updateMCPServer: (id, updates) => set((state) => ({
        mcpServers: state.mcpServers.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),
      removeMCPServer: (id) => set((state) => ({
        mcpServers: state.mcpServers.filter((s) => s.id !== id)
      })),
      toggleMCPServer: (id) => set((state) => ({
        mcpServers: state.mcpServers.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s)
      })),
      
      // Settings
      settings: defaultSettings,
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      // Chat Sessions
      sessions: [],
      currentSessionId: null,
      createSession: () => {
        const id = `session-${Date.now()}`;
        const session: ChatSession = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          currentSessionId: id
        }));
        return id;
      },
      deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== id),
        currentSessionId: state.currentSessionId === id ? null : state.currentSessionId
      })),
      setCurrentSession: (id) => set({ currentSessionId: id }),
      addMessage: (sessionId, message) => set((state) => ({
        sessions: state.sessions.map((s) => {
          if (s.id !== sessionId) return s;
          const newMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: Date.now()
          };
          const title = s.messages.length === 0 && message.role === 'user' 
            ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
            : s.title;
          return {
            ...s,
            title,
            messages: [...s.messages, newMessage],
            updatedAt: Date.now()
          };
        })
      })),
      clearSession: (id) => set((state) => ({
        sessions: state.sessions.map((s) => 
          s.id === id ? { ...s, messages: [], updatedAt: Date.now() } : s
        )
      }))
    }),
    {
      name: 'goldfire-ai-storage',
      version: 1
    }
  )
);
