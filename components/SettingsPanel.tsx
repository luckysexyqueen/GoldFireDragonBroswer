'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2, FiCheck } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIStore } from '@/lib/store/aiStore';
import { modelStorage } from '@/lib/storage/modelStorage';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { models, addModel, removeModel, setActiveModel, activeModelId } = useAIStore();
  const [isMounted, setIsMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0 });
  const [apiKey, setApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState('openai');

  useEffect(() => {
    setIsMounted(true);
    updateStorageInfo();
  }, []);

  const updateStorageInfo = async () => {
    const info = await modelStorage.getStorageSize();
    setStorageInfo(info);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const modelId = Date.now().toString();

      // Save to IndexedDB
      await modelStorage.saveModel({
        id: modelId,
        name: file.name,
        size: file.size,
        type: file.type,
        data: arrayBuffer,
        uploadedAt: Date.now(),
      });

      // Add to store
      addModel({
        id: modelId,
        name: file.name,
        type: 'local',
        config: {},
        uploadedAt: Date.now(),
      });

      await updateStorageInfo();
    } catch (error) {
      console.error('Failed to upload model:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveModel = async (id: string) => {
    try {
      await modelStorage.deleteModel(id);
      removeModel(id);
      await updateStorageInfo();
    } catch (error) {
      console.error('Failed to remove model:', error);
    }
  };

  const handleAddAPIModel = () => {
    if (!apiKey.trim()) return;

    const apiModelId = Date.now().toString();
    addModel({
      id: apiModelId,
      name: `${apiProvider} API`,
      type: 'api',
      config: {
        apiKey,
        provider: apiProvider,
      },
      uploadedAt: Date.now(),
    });

    setApiKey('');
  };

  if (!isMounted) return null;

  const usedGB = (storageInfo.used / (1024 * 1024 * 1024)).toFixed(2);
  const quotaGB = (storageInfo.quota / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <FiX className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <ScrollArea className="flex-1">
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="models">My Models</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Upload Model File</h3>
              <label className="flex cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".gguf"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  disabled={uploading}
                >
                  <FiUpload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload .gguf File'}
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Supported: .gguf files (Llama, Gemma, Qwen, etc.)
              </p>
            </div>

            {/* Storage Info */}
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs font-semibold mb-2">Storage Usage</p>
              <div className="w-full bg-border rounded-full h-2 mb-1">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${(storageInfo.used / storageInfo.quota) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {usedGB} GB / {quotaGB} GB used
              </p>
            </div>

            {/* Models List */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Your Models</h3>
              <div className="space-y-2">
                {models.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No models yet</p>
                ) : (
                  models.map((model) => (
                    <div
                      key={model.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        activeModelId === model.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background border-border'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {model.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {model.type === 'local' ? '📁 Local' : '🔑 API'}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        {activeModelId !== model.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveModel(model.id)}
                          >
                            <FiCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveModel(model.id)}
                        >
                          <FiTrash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                API Provider
              </label>
              <select
                value={apiProvider}
                onChange={(e) => setApiProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
              >
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="gemini">Google (Gemini)</option>
                <option value="groq">Groq</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${apiProvider} API key`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                🔒 Keys are stored locally only (never sent to our servers)
              </p>
            </div>

            <Button
              onClick={handleAddAPIModel}
              disabled={!apiKey.trim()}
              className="w-full"
            >
              Add API Model
            </Button>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Search Engine
              </label>
              <select className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm">
                <option>Google</option>
                <option>DuckDuckGo</option>
                <option>Bing</option>
                <option>Brave</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Theme</label>
              <select className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm">
                <option>Dark (Default)</option>
                <option>Light</option>
              </select>
            </div>

            <div className="bg-background rounded-lg p-3 mt-6">
              <p className="text-xs font-semibold mb-2">About</p>
              <p className="text-xs text-muted-foreground">
                GoldFireDragon v1.0
              </p>
              <p className="text-xs text-muted-foreground">
                AI-powered private browser
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
