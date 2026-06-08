import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Sparkles } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in space-y-4">
      <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-7 shadow-xl shadow-gray-200/50 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800/80 dark:shadow-gray-900/50">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your ArcMind account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-gradient-to-r from-red-50 to-red-50/50 p-3.5 text-sm text-red-600 dark:from-red-900/20 dark:to-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </Button>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-arc-600 transition-colors hover:text-arc-700 dark:text-arc-400 dark:hover:text-arc-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
