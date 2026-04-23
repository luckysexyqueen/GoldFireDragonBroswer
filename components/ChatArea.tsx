'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIStore } from '@/lib/store/aiStore';
import { aiEngine } from '@/lib/ai/engine';
import { modelStorage } from '@/lib/storage/modelStorage';

interface ChatAreaProps {
  className?: string;
}

export function ChatArea({ className = '' }: ChatAreaProps) {
  const {
    conversations,
    currentConversationId,
    addMessage,
    activeModelId,
    models,
  } = useAIStore();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations[currentConversationId || '']?.length]);

  // Initialize AI engine when active model changes
  useEffect(() => {
    if (!activeModelId || !isMounted) return;

    const initializeAI = async () => {
      setIsInitializing(true);
      try {
        const model = models.find((m) => m.id === activeModelId);
        if (!model) return;

        if (model.type === 'local') {
          // Load model file from IndexedDB
          const modelFile = await modelStorage.getModel(model.id);
          if (modelFile) {
            console.log(`[v0] Loading model: ${model.name}`);
            // Initialize with WebLLM
            await aiEngine.initialize({
              modelId: model.name.replace('.gguf', ''),
              provider: 'webllm',
            });
          }
        } else {
          // Initialize API-based model
          await aiEngine.initialize({
            modelId: model.id,
            apiKey: model.config.apiKey,
            provider: model.config.provider,
          });
        }
      } catch (error) {
        console.error('[v0] Failed to initialize AI:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAI();
  }, [activeModelId, isMounted, models]);

  if (!isMounted) return null;

  const currentMessages = conversations[currentConversationId || ''] || [];

  const handleSendMessage = async () => {
    if (!input.trim() || !currentConversationId || !activeModelId || isSending || isInitializing) {
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: Date.now(),
    };

    addMessage(currentConversationId, userMessage);
    setInput('');
    setIsSending(true);

    try {
      // Convert messages format for AI engine
      const messagesForAI = currentMessages
        .concat(userMessage)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      let aiResponseText = '';

      // Get response from AI engine
      await aiEngine.chat(messagesForAI, (chunk) => {
        aiResponseText += chunk;
        // Update the message in real-time
        console.log('[v0] Received chunk:', chunk);
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponseText || 'Sorry, I could not generate a response.',
        timestamp: Date.now(),
      };

      addMessage(currentConversationId, aiMessage);
    } catch (error) {
      console.error('[v0] Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant' as const,
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: Date.now(),
      };
      addMessage(currentConversationId, errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`flex flex-col bg-background ${className}`}>
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-4">💬</div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Start a conversation
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  {isInitializing
                    ? 'Loading model...'
                    : activeModelId
                      ? 'Select a model in settings and start chatting'
                      : 'First, upload or select a model in settings'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-md rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground border border-border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={!activeModelId || isSending || isInitializing}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!activeModelId || !input.trim() || isSending || isInitializing}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <FiSend className="h-4 w-4" />
          </Button>
        </div>
        {!activeModelId && (
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ Select or upload a model first
          </p>
        )}
        {isInitializing && (
          <p className="text-xs text-muted-foreground mt-2">
            ⏳ Initializing model...
          </p>
        )}
      </div>
    </div>
  );
}

  return (
    <div className={`flex flex-col bg-background ${className}`}>
      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-4">💬</div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Start a conversation
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  {activeModelId
                    ? 'Select a model in settings and start chatting'
                    : 'First, upload or select a model in settings'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-md rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground border border-border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={!activeModelId || isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!activeModelId || !input.trim() || isSending}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <FiSend className="h-4 w-4" />
          </Button>
        </div>
        {!activeModelId && (
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ Select or upload a model first
          </p>
        )}
      </div>
    </div>
  );
}
