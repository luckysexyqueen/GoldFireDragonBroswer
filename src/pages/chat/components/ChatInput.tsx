import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [message]);

  const handleSubmit = () => {
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-white/30 resize-none px-3 py-2 focus:outline-none disabled:opacity-50"
            style={{ maxHeight: '150px' }}
          />
          
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              className="p-2 text-white/40 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
              title="Attach file"
            >
              <i className="ri-attachment-2 text-lg" />
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!message.trim() || disabled}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-white/10 disabled:text-white/30 text-black rounded-lg transition-colors"
            >
              <i className="ri-send-plane-fill text-lg" />
            </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-white/30 mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
