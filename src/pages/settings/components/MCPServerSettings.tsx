import { useState } from 'react';
import { useAIStore, MCPServer } from '../../../stores/aiStore';

export default function MCPServerSettings() {
  const { mcpServers, addMCPServer, updateMCPServer, removeMCPServer, toggleMCPServer } = useAIStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newServer, setNewServer] = useState<Partial<MCPServer>>({
    name: '',
    url: '',
    description: ''
  });

  const presetServers = [
    { name: 'File System', url: 'npx -y @anthropic-ai/mcp-server-filesystem', description: 'Access local file system' },
    { name: 'GitHub', url: 'npx -y @anthropic-ai/mcp-server-github', description: 'GitHub repository access' },
    { name: 'Web Search', url: 'npx -y @anthropic-ai/mcp-server-brave-search', description: 'Web search capabilities' },
    { name: 'SQLite', url: 'npx -y @anthropic-ai/mcp-server-sqlite', description: 'SQLite database access' },
    { name: 'Memory', url: 'npx -y @anthropic-ai/mcp-server-memory', description: 'Persistent memory storage' },
  ];

  const handleAdd = () => {
    if (!newServer.name || !newServer.url) return;
    
    const server: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: newServer.name,
      url: newServer.url,
      description: newServer.description || '',
      enabled: true
    };
    
    addMCPServer(server);
    setNewServer({ name: '', url: '', description: '' });
    setShowAdd(false);
  };

  const handleAddPreset = (preset: typeof presetServers[0]) => {
    const exists = mcpServers.some(s => s.url === preset.url);
    if (exists) return;
    
    const server: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: preset.name,
      url: preset.url,
      description: preset.description,
      enabled: true
    };
    
    addMCPServer(server);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
            <i className="ri-server-line text-yellow-400 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">MCP Server</h2>
            <p className="text-sm text-white/60">Configure Model Context Protocol servers</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
        >
          <i className={showAdd ? "ri-close-line" : "ri-add-line"} />
          <span className="text-sm">{showAdd ? 'Cancel' : 'Add Server'}</span>
        </button>
      </div>

      {/* Quick Add Presets */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
        <h3 className="text-white font-medium mb-3">Quick Add Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {presetServers.map((preset) => {
            const isAdded = mcpServers.some(s => s.url === preset.url);
            return (
              <button
                key={preset.name}
                onClick={() => handleAddPreset(preset)}
                disabled={isAdded}
                className={`flex flex-col items-start p-3 rounded-lg border transition-colors ${
                  isAdded
                    ? 'bg-green-500/10 border-green-500/30 cursor-default'
                    : 'bg-black/20 border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/10'
                }`}
              >
                <span className="text-sm text-white font-medium">{preset.name}</span>
                <span className="text-xs text-white/50 mt-1">
                  {isAdded ? 'Added' : 'Click to add'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Server */}
      {showAdd && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-yellow-500/30 space-y-4">
          <h3 className="text-white font-medium">Add Custom MCP Server</h3>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Server Name</label>
            <input
              type="text"
              value={newServer.name}
              onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
              placeholder="My MCP Server"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Server URL / Command</label>
            <input
              type="text"
              value={newServer.url}
              onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
              placeholder="npx -y @your/mcp-server or http://localhost:3001"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-1">Description (optional)</label>
            <input
              type="text"
              value={newServer.description}
              onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
              placeholder="What does this server do?"
              className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-yellow-500/50"
            />
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!newServer.name || !newServer.url}
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-white/10 disabled:text-white/30 text-black font-medium rounded-lg transition-colors"
          >
            Add Server
          </button>
        </div>
      )}

      {/* Server List */}
      <div className="space-y-3">
        {mcpServers.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
            <i className="ri-server-line text-4xl text-white/20 mb-3" />
            <p className="text-white/50">No MCP servers configured</p>
            <p className="text-sm text-white/30 mt-1">Add a preset or custom server above</p>
          </div>
        ) : (
          mcpServers.map((server) => (
            <div
              key={server.id}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border transition-colors ${
                server.enabled ? 'border-green-500/30' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{server.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      server.enabled ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/50'
                    }`}>
                      {server.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  {server.description && (
                    <p className="text-sm text-white/60 mb-2">{server.description}</p>
                  )}
                  {editingId === server.id ? (
                    <input
                      type="text"
                      defaultValue={server.url}
                      onBlur={(e) => {
                        updateMCPServer(server.id, { url: e.target.value });
                        setEditingId(null);
                      }}
                      className="w-full bg-black/30 border border-white/20 rounded px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:border-yellow-500/50"
                    />
                  ) : (
                    <code className="text-xs text-white/40 block truncate">{server.url}</code>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMCPServer(server.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                      server.enabled ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        server.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setEditingId(editingId === server.id ? null : server.id)}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <i className="ri-edit-line text-sm" />
                  </button>
                  <button
                    onClick={() => removeMCPServer(server.id)}
                    className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
