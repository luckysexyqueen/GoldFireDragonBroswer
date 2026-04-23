import { useState } from 'react';
import { Link } from 'react-router-dom';
import GeneralSettings from './components/GeneralSettings';
import AIAssistantSettings from './components/AIAssistantSettings';
import PromptsSettings from './components/PromptsSettings';
import MCPServerSettings from './components/MCPServerSettings';
import ModelsSettings from './components/ModelsSettings';

type SettingsSection = 'general' | 'assistant' | 'prompts' | 'mcp' | 'models';

const menuItems: { id: SettingsSection; label: string; icon: string; category: string }[] = [
  { id: 'general', label: 'General', icon: 'ri-settings-3-line', category: 'AI Tools' },
  { id: 'assistant', label: 'AI Assistant', icon: 'ri-robot-line', category: 'AI Tools' },
  { id: 'prompts', label: 'Prompts', icon: 'ri-file-text-line', category: 'AI Tools' },
  { id: 'mcp', label: 'MCP Server', icon: 'ri-server-line', category: 'AI Tools' },
  { id: 'models', label: 'AI Models', icon: 'ri-cpu-line', category: 'Models' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'assistant':
        return <AIAssistantSettings />;
      case 'prompts':
        return <PromptsSettings />;
      case 'mcp':
        return <MCPServerSettings />;
      case 'models':
        return <ModelsSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('https://cdn-ai.onspace.ai/onspace/project/code/latest/9besdg-WnErExyYPJsw8ZZVzFgW6p-1776522606805196/GoldFireDragonBrowser%20home%20page.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 fixed" />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 px-4 py-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <i className="ri-arrow-left-line text-xl" />
        </Link>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        
        {/* Mobile menu toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="ml-auto md:hidden p-2 text-white/70 hover:text-white"
        >
          <i className={showMobileMenu ? "ri-close-line text-xl" : "ri-menu-line text-xl"} />
        </button>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-0 top-[65px] z-20 
            w-64 bg-black/50 backdrop-blur-md border-r border-white/10
            transform transition-transform duration-300
            ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-6 overflow-y-auto h-full">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-yellow-400 text-sm font-semibold mb-3 px-3">
                  {category}
                </h3>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveSection(item.id);
                          setShowMobileMenu(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200
                          ${activeSection === item.id
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <i className={`${item.icon} text-lg`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 top-[65px] bg-black/50 z-10 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
