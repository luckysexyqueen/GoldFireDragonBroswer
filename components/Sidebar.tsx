'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIStore } from '@/lib/store/aiStore';

export function Sidebar() {
  const { conversations, currentConversationId, createConversation, setCurrentConversation } = useAIStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const conversationList = Object.entries(conversations || {});

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* New Conversation */}
      <div className="p-4">
        <Button
          onClick={createConversation}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <FiPlus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {conversationList.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No conversations yet
            </p>
          ) : (
            conversationList.map(([id, messages]) => (
              <button
                key={id}
                onClick={() => setCurrentConversation(id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  currentConversationId === id
                    ? 'bg-primary/20 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex items-start gap-2 min-h-5">
                  <FiMessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {messages[0]?.content?.substring(0, 40) || 'New chat'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Divider */}
      <div className="border-t border-sidebar-border" />

      {/* Footer Info */}
      <div className="p-4 text-xs text-muted-foreground">
        <p>Local & API Models</p>
        <p>Private by default</p>
      </div>
    </aside>
  );
}
