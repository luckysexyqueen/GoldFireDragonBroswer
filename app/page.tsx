'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatArea } from '@/components/ChatArea';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Header } from '@/components/Header';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header onSettingsClick={() => setShowSettings(!showSettings)} />

        {/* Chat & Settings */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <ChatArea className={showSettings ? 'w-2/3' : 'w-full'} />

          {/* Settings Panel */}
          {showSettings && (
            <div className="w-1/3 border-l border-border bg-card">
              <SettingsPanel onClose={() => setShowSettings(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
