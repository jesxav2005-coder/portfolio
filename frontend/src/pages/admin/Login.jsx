import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Lock, User, Code } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Authenticating...');
    try {
      await login(data.username, data.password);
      toast.success('Welcome back, Admin!', { id: toastId });
      navigate('/admin');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Authentication failed. Please check credentials.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>

      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 relative z-10 shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-400 mb-3 border border-indigo-500/20">
            <Code className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Admin Dashboard</h2>
          <p className="text-slate-500 text-xs mt-1">Please sign in to manage your portfolio</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="admin"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-600/10 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
