import { Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AuthLayout({ children }) {
  const { dark, toggle } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-arc-500/10 to-purple-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-gradient-to-br from-arc-400/5 to-purple-500/5 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={toggle}
          className="rounded-xl border border-gray-200/80 bg-white/80 p-2.5 text-gray-500 shadow-sm backdrop-blur-md transition-all hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="rounded-2xl bg-gradient-to-br from-arc-600 to-purple-600 p-2.5 shadow-lg shadow-arc-600/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ArcMind
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-Powered Business Assistant
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
