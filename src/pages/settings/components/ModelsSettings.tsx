import { useState } from 'react';
import { useAIStore, AIModel } from '../../../stores/aiStore';

export default function ModelsSettings() {
  const { models, addModel, updateModel, removeModel, toggleModel } = useAIStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newModel, setNewModel] = useState<Partial<AIModel>>({
    name: '',
    provider: 'custom',
    type: 'online',
    endpoint: '',
    apiKey: '',
    modelId: ''
  });

  const handleAdd = () => {
    if (!newModel.name) return;
    
    const model: AIModel = {
      id: `model-${Date.now()}`,
      name: newModel.name,
      provider: newModel.provider || 'custom',
      type: newModel.type || 'online',
      endpoint: newModel.endpoint,
      apiKey: newModel.apiKey,
      modelId: newModel.modelId,
      enabled: true,
      description: `Custom ${newModel.provider} model`
    };
    
    addModel(model);
    setNewModel({ name: '', provider: 'custom', type: 'online', endpoint: '', apiKey: '', modelId: '' });
    setShowAdd(false);
  };

  const localModels = models.filter(m => m.type === 'local');
  const onlineModels = models.filter(m => m.type === 'online');

  const getProviderIcon = (provider: AIModel['provider']) => {
    switch (provider) {
      case 'ollama': return 'ri-terminal-box-line';
      case 'lmstudio': return 'ri-computer-line';
      case 'groq': return 'ri-flashlight-line';
      case 'together': return 'ri-group-line';
      case 'huggingface': return 'ri-bear-smile-line';
      case 'openrouter': return 'ri-route-line';
      default: return 'ri-cpu-line';
    }
  };

  const getProviderColor = (provider: AIModel['provider']) => {
    switch (provider) {
      case 'ollama': return 'text-blue-400';
      case 'lmstudio': return 'text-green-400';
      case 'groq': return 'text-orange-400';
      case 'together': return 'text-purple-400';
      case 'huggingface': return 'text-yellow-400';
      case 'openrouter': return 'text-pink-400';
      default: return 'text-white';
    }
  };

  const ModelCard = ({ model }: { model: AIModel }) => (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all ${
        model.enabled ? 'border-green-500/30 bg-green-500/5' : 'border-white/10'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center ${getProviderColor(model.provider)}`}>
          <i className={`${getProviderIcon(model.provider)} text-lg`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium truncate">{model.name}</h3>
            {model.enabled && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 shrink-0">
                Active
              </span>
            )}
          </div>
          {model.description && (
            <p className="text-xs text-white/50 mb-2 line-clamp-1">{model.description}</p>
          )}
          
          {editingId === model.id ? (
            <div className="space-y-2 mt-3">
              {model.type === 'online' && (
                <>
                  <input
                    type="text"
                    placeholder="API Key"
                    defaultValue={model.apiKey}
                    onChange={(e) => updateModel(model.id, { apiKey: e.target.value })}
                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                  />
                  <input
                    type="text"
                    placeholder="Model ID"
                    defaultValue={model.modelId}
                    onChange={(e) => updateModel(model.id, { modelId: e.target.value })}
                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
                  />
                </>
              )}
              <input
                type="text"
                placeholder="Endpoint URL"
                defaultValue={model.endpoint}
                onChange={(e) => updateModel(model.id, { endpoint: e.target.value })}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
              <button
                onClick={() => setEditingId(null)}
                className="text-sm text-yellow-400 hover:text-yellow-300"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="capitalize">{model.provider}</span>
              {model.modelId && (
                <>
                  <span>•</span>
                  <span className="truncate">{model.modelId}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => toggleModel(model.id)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
              model.enabled ? 'bg-green-500' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                model.enabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <button
            onClick={() => setEditingId(editingId === model.id ? null : model.id)}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <i className="ri-settings-4-line text-sm" />
          </button>
          {!model.id.includes('-default') && !model.id.includes('-free') && (
            <button
              onClick={() => removeModel(model.id)}
              className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <i className="ri-delete-bin-line text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <i className="ri-cpu-line text-yellow-400 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Models</h2>
            <p className="text-sm text-white/60">Configure free AI models</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
        >
          <i className={showAdd ? "ri-close-line" : "ri-add-line"} />
          <span className="text-sm">{showAdd ? 'Cancel' : 'Add Model'}</span>
        </button>
      </div>

      {/* Add Custom Model */}
      {showAdd && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-yellow-500/30 space-y-4">
          <h3 className="text-white font-medium">Add Custom Model</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Model Name</label>
              <input
                type="text"
                value={newModel.name}
                onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                placeholder="My Model"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-1">Provider</label>
              <select
                value={newModel.provider}
                onChange={(e) => setNewModel({ ...newModel, provider: e.target.value as AIModel['provider'] })}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="ollama">Ollama</option>
                <option value="lmstudio">LM Studio</option>
                <option value="groq">Groq</option>
                <option value="together">Together AI</option>
                <option value="huggingface">HuggingFace</option>
                <option value="openrouter">OpenRouter</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Type</label>
              <select
                value={newModel.type}
                onChange={(e) => setNewModel({ ...newModel, type: e.target.value as AIModel['type'] })}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/50"
              >
                <option value="local">Local</option>
                <option value="online">Online</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-white/60 mb-1">Model ID</label>
              <input
                type="text"
                value={newModel.modelId}
                onChange={(e) => setNewModel({ ...newModel, modelId: e.target.value })}
                placeholder="llama-3.3-70b"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Endpoint URL</label>
            <input
              type="text"
              value={newModel.endpoint}
              onChange={(e) => setNewModel({ ...newModel, endpoint: e.target.value })}
              placeholder="https://api.example.com/v1"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">API Key (optional)</label>
            <input
              type="password"
              value={newModel.apiKey}
              onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!newModel.name}
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-white/10 disabled:text-white/30 text-black font-medium rounded-lg transition-colors"
          >
            Add Model
          </button>
        </div>
      )}

      {/* Local Models */}
      <div>
        <h3 className="text-yellow-400 text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="ri-computer-line" />
          Local Models (Unlimited & Free)
        </h3>
        <div className="space-y-3">
          {localModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      {/* Online Models */}
      <div>
        <h3 className="text-yellow-400 text-sm font-semibold mb-3 flex items-center gap-2">
          <i className="ri-cloud-line" />
          Online Models (Free Tiers)
        </h3>
        <div className="space-y-3">
          {onlineModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20">
        <div className="flex items-start gap-3">
          <i className="ri-information-line text-yellow-400 text-lg mt-0.5" />
          <div className="text-sm">
            <p className="text-yellow-200 font-medium mb-1">Free Models Info</p>
            <ul className="text-yellow-200/70 space-y-1 text-xs">
              <li>• <strong>Ollama/LM Studio:</strong> Run locally, completely unlimited</li>
              <li>• <strong>Groq:</strong> Very fast, free tier with rate limits</li>
              <li>• <strong>Together AI:</strong> Free models available</li>
              <li>• <strong>HuggingFace:</strong> Free inference API</li>
              <li>• <strong>OpenRouter:</strong> Many free models</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
