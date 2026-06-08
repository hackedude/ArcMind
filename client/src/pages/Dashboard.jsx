import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Upload,
  Sparkles,
  Zap,
} from 'lucide-react';
import { documentService } from '../services/documents';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentService
      .stats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Documents',
      value: data?.stats?.totalDocuments || 0,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'AI Chats',
      value: data?.stats?.totalChats || 0,
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/20',
      bg: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Processed',
      value: data?.stats?.processedDocuments || 0,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      label: 'Pending',
      value:
        (data?.stats?.totalDocuments || 0) -
        (data?.stats?.processedDocuments || 0),
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
      bg: 'bg-amber-50 dark:bg-amber-950',
    },
  ];

  const recentDocs = data?.recentDocuments || [];
  const recentChats = data?.recentChats || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of your business documents and AI activity
          </p>
        </div>
        <Link
          to="/documents"
          className="group hidden items-center gap-2 rounded-xl bg-gradient-to-r from-arc-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-arc-600/25 transition-all hover:shadow-xl hover:shadow-arc-600/30 sm:flex"
        >
          <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          Upload Document
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, gradient, shadow, bg }) => (
          <div
            key={label}
            className="stat-card group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800"
          >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform">
              <div className={`h-full w-full rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-2xl`} />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1.5 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    {value}
                  </p>
                </div>
                <div className={`flex items-center justify-center rounded-2xl p-3 ${bg} ${shadow}`}>
                  <Icon className={`h-6 w-6 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span>Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Card className="h-full">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-gradient-to-br from-arc-500 to-purple-600 p-2 shadow-sm">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Recent Documents
                </h2>
              </div>
              <Link
                to="/documents"
                className="group flex items-center gap-1 text-sm font-medium text-arc-600 transition-colors hover:text-arc-700 dark:text-arc-400"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {recentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-2xl bg-gradient-to-br from-arc-50 to-purple-50 p-4 dark:from-arc-950 dark:to-purple-950">
                  <Upload className="h-8 w-8 text-arc-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No documents yet
                </p>
                <p className="text-xs text-gray-500">
                  Upload your first PDF to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentDocs.map((doc, i) => (
                  <div
                    key={doc.id}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-all hover:border-arc-200 hover:shadow-sm dark:border-gray-700/50 dark:hover:border-arc-800 dark:hover:bg-gray-800/50"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-arc-50 to-purple-50 dark:from-arc-950 dark:to-purple-950">
                        <FileText className="h-4 w-4 text-arc-600 dark:text-arc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {doc.original_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>·</span>
                          {doc.summary ? (
                            <span className="flex items-center gap-1 text-arc-500">
                              <Sparkles className="h-3 w-3" />
                              AI ready
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-500">
                              <Zap className="h-3 w-3" />
                              Processing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant={doc.status}>{doc.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2 shadow-sm">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Recent Chats
                </h2>
              </div>
              <Link
                to="/chat"
                className="group flex items-center gap-1 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {recentChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-950 dark:to-pink-950">
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No chats yet
                </p>
                <p className="text-xs text-gray-500">
                  Start a conversation with ArcMind AI
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentChats.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-all hover:border-purple-200 hover:shadow-sm dark:border-gray-700/50 dark:hover:border-purple-800 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                      <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chat.last_message
                          ? chat.last_message.slice(0, 60) + '...'
                          : new Date(chat.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
