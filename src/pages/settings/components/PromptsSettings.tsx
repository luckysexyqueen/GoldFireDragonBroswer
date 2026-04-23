import { useState } from 'react';
import { useAIStore, PromptTemplate } from '../../../stores/aiStore';

export default function PromptsSettings() {
  const { prompts, addPrompt, updatePrompt, removePrompt } = useAIStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newPrompt, setNewPrompt] = useState<Partial<PromptTemplate>>({
    name: '',
    content: '',
    category: 'system'
  });

  const handleSave = () => {
    if (!newPrompt.name || !newPrompt.content) return;
    
    const prompt: PromptTemplate = {
      id: `prompt-${Date.now()}`,
      name: newPrompt.name,
      content: newPrompt.content,
      category: newPrompt.category || 'system'
    };
    
    addPrompt(prompt);
    setNewPrompt({ name: '', content: '', category: 'system' });
    setShowAdd(false);
  };

  const handleUpdate = (id: string, content: string) => {
    updatePrompt(id, { content });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <i className="ri-file-text-line text-yellow-400 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Prompts</h2>
            <p className="text-sm text-white/60">Manage prompt templates</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
        >
          <i className={showAdd ? "ri-close-line" : "ri-add-line"} />
          <span className="text-sm">{showAdd ? 'Cancel' : 'Add New'}</span>
        </button>
      </div>

      {/* Add New Prompt */}
      {showAdd && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-yellow-500/30 space-y-4">
          <h3 className="text-white font-medium">New Prompt Template</h3>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Name</label>
            <input
              type="text"
              value={newPrompt.name}
              onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
              placeholder="My Custom Prompt"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Category</label>
            <select
              value={newPrompt.category}
              onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value as PromptTemplate['category'] })}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="system">System</option>
              <option value="user">User</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Content</label>
            <textarea
              value={newPrompt.content}
              onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
              placeholder="Enter your prompt template..."
              rows={4}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50 resize-none"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={!newPrompt.name || !newPrompt.content}
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-white/10 disabled:text-white/30 text-black font-medium rounded-lg transition-colors"
          >
            Save Prompt
          </button>
        </div>
      )}

      {/* Prompt List */}
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-medium">{prompt.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    prompt.category === 'system' ? 'bg-blue-500/20 text-blue-300' :
                    prompt.category === 'user' ? 'bg-green-500/20 text-green-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {prompt.category}
                  </span>
                  {prompt.isDefault && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
                      Default
                    </span>
                  )}
                </div>
                
                {editingId === prompt.id ? (
                  <div className="space-y-2">
                    <textarea
                      defaultValue={prompt.content}
                      rows={4}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 resize-none text-sm"
                      onBlur={(e) => handleUpdate(prompt.id, e.target.value)}
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm text-yellow-400 hover:text-yellow-300"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-white/60 line-clamp-2">{prompt.content}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingId(editingId === prompt.id ? null : prompt.id)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <i className="ri-edit-line" />
                </button>
                {!prompt.isDefault && (
                  <button
                    onClick={() => removePrompt(prompt.id)}
                    className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
