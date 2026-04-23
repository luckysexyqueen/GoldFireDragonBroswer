import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Model {
  id: string;
  name: string;
  type: 'local' | 'api';
  config: {
    apiKey?: string;
    provider?: string;
    endpoint?: string;
  };
  uploadedAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIStore {
  // Models
  models: Model[];
  addModel: (model: Model) => void;
  removeModel: (id: string) => void;
  updateModel: (id: string, updates: Partial<Model>) => void;
  
  // Active Model
  activeModelId: string | null;
  setActiveModel: (id: string) => void;
  
  // Chat
  conversations: Record<string, ChatMessage[]>;
  currentConversationId: string | null;
  createConversation: () => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  setCurrentConversation: (id: string) => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      models: [],
      addModel: (model) =>
        set((state) => ({
          models: [...state.models, model],
        })),
      removeModel: (id) =>
        set((state) => ({
          models: state.models.filter((m) => m.id !== id),
        })),
      updateModel: (id, updates) =>
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      activeModelId: null,
      setActiveModel: (id) => set({ activeModelId: id }),

      conversations: {},
      currentConversationId: null,
      createConversation: () =>
        set((state) => {
          const newId = Date.now().toString();
          return {
            conversations: {
              ...state.conversations,
              [newId]: [],
            },
            currentConversationId: newId,
          };
        }),
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId]: [
              ...(state.conversations[conversationId] || []),
              message,
            ],
          },
        })),
      setCurrentConversation: (id) => set({ currentConversationId: id }),
    }),
    {
      name: 'ai-store',
    }
  )
);
