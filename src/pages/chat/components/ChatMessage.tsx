import { ChatMessage as ChatMessageType } from '../../../stores/aiStore';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-blue-500/20' : 'bg-yellow-500/20'
      }`}>
        <i className={`${isUser ? 'ri-user-line text-blue-400' : 'ri-robot-line text-yellow-400'}`} />
      </div>

      {/* Message Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-500/20 rounded-tr-none border border-blue-500/20'
            : 'bg-white/5 rounded-tl-none border border-white/10'
        }`}>
          <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-white/30">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
