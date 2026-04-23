import { useAIStore } from '../../../stores/aiStore';

export default function GeneralSettings() {
  const { settings, updateSettings, models } = useAIStore();
  const enabledModels = models.filter(m => m.enabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <i className="ri-settings-3-line text-yellow-400 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">General Settings</h2>
          <p className="text-sm text-white/60">Configure basic AI settings</p>
        </div>
      </div>

      {/* Default Model */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Default AI Model
        </label>
        <select
          value={settings.defaultModel || ''}
          onChange={(e) => updateSettings({ defaultModel: e.target.value || null })}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/50"
        >
          <option value="">Select a model...</option>
          {enabledModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        {enabledModels.length === 0 && (
          <p className="mt-2 text-sm text-yellow-400/80">
            Enable models in the AI Models section first
          </p>
        )}
      </div>

      {/* Streaming */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Streaming Responses</h3>
            <p className="text-sm text-white/60 mt-1">Show AI responses as they are generated</p>
          </div>
          <button
            onClick={() => updateSettings({ streamingEnabled: !settings.streamingEnabled })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.streamingEnabled ? 'bg-yellow-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                settings.streamingEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Auto Save */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Auto-save Chats</h3>
            <p className="text-sm text-white/60 mt-1">Automatically save chat history</p>
          </div>
          <button
            onClick={() => updateSettings({ autoSaveChats: !settings.autoSaveChats })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.autoSaveChats ? 'bg-yellow-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                settings.autoSaveChats ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Temperature */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Temperature: {settings.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.temperature}
          onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Max Tokens: {settings.maxTokens}
        </label>
        <input
          type="range"
          min="256"
          max="8192"
          step="256"
          value={settings.maxTokens}
          onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-white/50 mt-1">
          <span>256</span>
          <span>8192</span>
        </div>
      </div>

      {/* Local Endpoints */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 space-y-4">
        <h3 className="text-white font-medium">Local AI Endpoints</h3>
        
        <div>
          <label className="block text-sm text-white/60 mb-1">Ollama Endpoint</label>
          <input
            type="text"
            value={settings.ollamaEndpoint}
            onChange={(e) => updateSettings({ ollamaEndpoint: e.target.value })}
            placeholder="http://localhost:11434"
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
          />
        </div>
        
        <div>
          <label className="block text-sm text-white/60 mb-1">LM Studio Endpoint</label>
          <input
            type="text"
            value={settings.lmStudioEndpoint}
            onChange={(e) => updateSettings({ lmStudioEndpoint: e.target.value })}
            placeholder="http://localhost:1234/v1"
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
          />
        </div>
      </div>
    </div>
  );
}
