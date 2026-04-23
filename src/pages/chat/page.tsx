import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAIStore } from '../../stores/aiStore';
import ChatSidebar from './components/ChatSidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

export default function ChatPage() {
  const {
    sessions,
    currentSessionId,
    createSession,
    setCurrentSession,
    addMessage,
    models,
    settings
  } = useAIStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const enabledModels = models.filter(m => m.enabled);
  const activeModel = enabledModels.find(m => m.id === settings.defaultModel) || enabledModels[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createSession();
    }

    // Add user message
    addMessage(sessionId, { role: 'user', content });

    setIsLoading(true);

    try {
      // Simulate AI response (in real app, call the actual API)
      const response = await simulateAIResponse(content, activeModel);
      addMessage(sessionId, { role: 'assistant', content: response });
    } catch (error) {
      addMessage(sessionId, {
        role: 'assistant',
        content: 'Error: Could not get response. Please check your model settings.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (replace with actual API calls)
  const simulateAIResponse = async (message: string, model: typeof activeModel): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    if (!model) {
      return `No AI model is enabled. Please go to Settings > AI Models and enable at least one model.`;
    }

    // In a real implementation, you would call the actual API based on the provider
    const responses = [
      `I'm ${settings.assistantName}, powered by ${model.name}. How can I help you with "${message}"?`,
      `Great question about "${message}"! Let me think about this...`,
      `Using ${model.name} to process your request about "${message}".`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
      `\n\nNote: This is a demo response. Connect to a real AI model in Settings for actual responses.`;
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundImage: "url('https://cdn-ai.onspace.ai/onspace/project/code/latest/9besdg-WnErExyYPJsw8ZZVzFgW6p-1776522606805196/GoldFireDragonBrowser%20home%20page.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 fixed" />

      {/* Sidebar */}
      <ChatSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSession}
        onNewChat={createSession}
      />

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center gap-4 px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors md:hidden"
          >
            <i className="ri-menu-line text-xl" />
          </button>
          
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="hidden md:flex p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <i className="ri-menu-line text-xl" />
          </button>

          <div className="flex-1">
            <h1 className="text-white font-medium">
              {currentSession?.title || 'New Chat'}
            </h1>
            {activeModel && (
              <p className="text-xs text-white/50">{activeModel.name}</p>
            )}
          </div>

          <Link
            to="/settings"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <i className="ri-settings-3-line text-xl" />
          </Link>
          
          <Link
            to="/"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <i className="ri-home-line text-xl" />
          </Link>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {!currentSession || currentSession.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                  <i className="ri-robot-line text-4xl text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{settings.assistantName}</h2>
                <p className="text-white/60 max-w-md mb-6">
                  {activeModel
                    ? `Powered by ${activeModel.name}. Start a conversation!`
                    : 'Enable an AI model in Settings to start chatting.'
                  }
                </p>
                
                {!activeModel && (
                  <Link
                    to="/settings"
                    className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                  >
                    Configure AI Models
                  </Link>
                )}

                {activeModel && (
                  <div className="grid grid-cols-2 gap-2 max-w-md w-full mt-4">
                    {['Hello!', 'Help me code', 'Explain this', 'Translate'].map((starter) => (
                      <button
                        key={starter}
                        onClick={() => handleSend(starter)}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              currentSession.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <i className="ri-robot-line text-yellow-400" />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 border border-white/10">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
