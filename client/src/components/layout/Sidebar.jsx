import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/chat', label: 'AI Chat', icon: MessageSquare },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200/80 bg-white transition-transform dark:border-gray-700/50 dark:bg-gray-900 lg:static lg:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        <div className="relative flex h-16 items-center gap-2.5 border-b border-gray-100 px-6 dark:border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-r from-arc-600/5 to-transparent" />
          <div className="relative flex items-center gap-2.5">
            <div className="rounded-xl bg-gradient-to-br from-arc-500 to-purple-600 p-2 shadow-lg shadow-arc-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ArcMind
              </span>
              <p className="text-[10px] font-medium tracking-wide text-arc-500">
                AI BUSINESS ASSISTANT
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 p-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Main Menu
          </p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'active bg-gradient-to-r from-arc-50 to-transparent text-arc-700 dark:from-arc-950 dark:text-arc-300'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={clsx(
                      'flex items-center justify-center rounded-lg p-1.5 transition-all',
                      isActive
                        ? 'bg-arc-600 text-white shadow-sm shadow-arc-500/30'
                        : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-arc-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 p-3 dark:from-gray-800/50 dark:to-gray-800/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-arc-500 to-purple-600 text-sm font-bold text-white shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name || 'User'}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.company || 'Free Plan'}
              </p>
            </div>
            <div className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
