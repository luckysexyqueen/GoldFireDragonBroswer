import { useAIStore } from '../../../stores/aiStore';

export default function AIAssistantSettings() {
  const { settings, updateSettings } = useAIStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <i className="ri-robot-line text-yellow-400 text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Assistant</h2>
          <p className="text-sm text-white/60">Configure your AI assistant</p>
        </div>
      </div>

      {/* Assistant Name */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          Assistant Name
        </label>
        <input
          type="text"
          value={settings.assistantName}
          onChange={(e) => updateSettings({ assistantName: e.target.value })}
          placeholder="AI Assistant"
          className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
        />
      </div>

      {/* System Prompt */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <label className="block text-sm font-medium text-white/80 mb-2">
          System Prompt
        </label>
        <textarea
          value={settings.systemPrompt}
          onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
          placeholder="You are a helpful AI assistant..."
          rows={6}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 resize-none"
        />
        <p className="text-xs text-white/50 mt-2">
          This prompt will be sent at the start of every conversation
        </p>
      </div>

      {/* Voice */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Voice Input</h3>
            <p className="text-sm text-white/60 mt-1">Enable voice input for chat</p>
          </div>
          <button
            onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.voiceEnabled ? 'bg-yellow-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                settings.voiceEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Prompts Preview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <h3 className="text-white font-medium mb-3">Sample Conversation Starters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Explain this concept to me',
            'Help me write code',
            'Translate this text',
            'Summarize this article'
          ].map((starter, idx) => (
            <div
              key={idx}
              className="bg-black/20 rounded-lg px-3 py-2 text-sm text-white/70 border border-white/10"
            >
              {starter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
