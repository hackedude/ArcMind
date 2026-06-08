import { useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200/80 bg-white shadow-lg shadow-gray-200/50 backdrop-blur-md transition-all focus-within:border-arc-400 focus-within:shadow-arc-500/10 dark:border-gray-700/50 dark:bg-gray-800 dark:shadow-gray-900/50"
    >
      <div className="flex items-end gap-2 p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          rows={1}
          className="flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
          disabled={disabled}
          style={{ maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-arc-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-arc-600/20 transition-all hover:shadow-xl hover:shadow-arc-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </form>
  );
}
