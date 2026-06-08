import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Trash2, Sparkles } from 'lucide-react';

export default function ChatSidebar({ chats, onNew, onDelete, currentId }) {
  return (
    <div className="flex h-full flex-col border-r border-gray-200/80 bg-gradient-to-b from-gray-50 to-white dark:border-gray-700/50 dark:from-gray-800/50 dark:to-gray-900/50">
      <div className="border-b border-gray-200/80 p-4 dark:border-gray-700/50">
        <button
          onClick={onNew}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-arc-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-arc-600/20 transition-all hover:shadow-xl hover:shadow-arc-600/30"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-3 dark:from-purple-950 dark:to-pink-950">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <p className="mt-3 text-xs text-gray-400">
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  currentId === chat.id
                    ? 'bg-gradient-to-r from-arc-50 to-transparent text-arc-700 shadow-sm dark:from-arc-950 dark:text-arc-300'
                    : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-lg p-1.5 ${
                    currentId === chat.id
                      ? 'bg-arc-600 text-white shadow-sm shadow-arc-500/20'
                      : 'text-gray-400'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1 truncate">{chat.title}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(chat.id);
                  }}
                  className="shrink-0 rounded-lg p-1 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200/80 p-3 dark:border-gray-700/50">
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-arc-50/50 to-purple-50/50 p-2.5 dark:from-arc-950/30 dark:to-purple-950/30">
          <Sparkles className="h-3.5 w-3.5 text-arc-500" />
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Ask questions about your documents
          </p>
        </div>
      </div>
    </div>
  );
}
