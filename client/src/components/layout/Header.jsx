import { useState } from 'react';
import { Menu, Moon, Sun, LogOut, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-64 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-arc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-arc-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-arc-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arc-400 opacity-75" />
            <span className="inline-flex h-full w-full rounded-full bg-arc-500" />
          </span>
        </button>

        <button
          onClick={toggle}
          className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-arc-500 to-purple-600 text-sm font-bold text-white shadow-sm shadow-arc-500/20">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.company || 'Business'}
              </p>
            </div>
          </button>

          {showProfile && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
