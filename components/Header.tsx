'use client';

import React from 'react';
import { FiSettings, FiMenu } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <span className="text-sm font-bold text-accent-foreground">GF</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground">GoldFireDragon</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          title="Settings"
        >
          <FiSettings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
