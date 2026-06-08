import { User, Sparkles } from 'lucide-react';

function formatContent(content) {
  const lines = content.split('\n');
  const formatted = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('**') && line.endsWith('**')) {
      formatted.push(
        <p key={i} className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.match(/^\*\*/)) {
      formatted.push(
        <p key={i} className="mb-1">
          <span className="font-semibold">{line.match(/^\*\*(.*?)\*\*/)?.[1]}</span>
          {line.replace(/^\*\*.*?\*\*/, '')}
        </p>
      );
    } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
      formatted.push(
        <div key={i} className="mb-1 flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-arc-500" />
          <span>{line.replace(/^[•-]\s*/, '')}</span>
        </div>
      );
    } else if (line.match(/^\d+\.\s/)) {
      formatted.push(
        <div key={i} className="mb-1 flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-arc-100 text-[10px] font-bold text-arc-700 dark:bg-arc-900/30 dark:text-arc-400">
            {line.match(/^(\d+)\.\s/)?.[1]}
          </span>
          <span>{line.replace(/^\d+\.\s/, '')}</span>
        </div>
      );
    } else if (line.trim() === '') {
      formatted.push(<div key={i} className="h-2" />);
    } else {
      formatted.push(
        <p key={i} className="mb-1 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return formatted;
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} fade-in`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-arc-500 to-arc-700 shadow-arc-500/20'
            : 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20'
        } rounded-xl shadow-lg`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Sparkles className="h-4 w-4 text-white" />
        )}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-arc-600 to-arc-700 text-white'
            : 'border border-gray-200/80 bg-white text-gray-900 shadow-sm dark:border-gray-700/50 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {formatContent(message.content)}
        </div>
        <p
          className={`mt-1.5 text-[10px] font-medium ${
            isUser ? 'text-arc-200' : 'text-gray-400'
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
