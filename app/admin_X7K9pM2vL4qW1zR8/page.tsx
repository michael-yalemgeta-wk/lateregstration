"use client";

import { useState } from 'react';
import StudentTab from '@/components/admin/StudentTab';
import CourseTab from '@/components/admin/CourseTab';
import ExportTab from '@/components/admin/ExportTab';
import SecurityTab from '@/components/admin/SecurityTab';
import { Users, BookOpen, DownloadCloud, Lock, LogOut, Loader2, User, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SecureAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'export' | 'security'>('students');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      // We use the secure RPC function instead of querying the table directly.
      // This protects the hashed passwords and keeps the table completely private.
      const { data: isValid, error: rpcError } = await supabase.rpc('verify_admin', {
        p_username: username,
        p_password: password
      });

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        setError('Database connection error. Ensure you ran the SQL setup.');
      } else if (!isValid) {
        setError('Invalid username or password.');
      } else {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('students');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-4 border-indigo-600">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-50 rounded-full ring-8 ring-indigo-50/50">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-800 mb-2">Secure Admin Portal</h1>
          <p className="text-center text-slate-500 mb-8 text-sm">Sign in to manage the registration system.</p>
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center font-medium">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-shadow"
                  placeholder="Enter username"
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-shadow"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {isLoggingIn ? 'Verifying Identity...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
                <span className="text-xl font-bold text-slate-800">Secure Admin</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-slate-500 mr-4 hidden sm:block">Logged in as <span className="font-semibold text-slate-700">admin</span></span>
              <button 
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 flex items-center text-sm font-medium transition-colors bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Console</h1>
          <p className="mt-1 text-sm text-slate-500">Manage student registrations, courses, and system security.</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8 bg-white px-2 rounded-t-xl shadow-sm">
          <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('students')}
              className={`${
                activeTab === 'students'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors rounded-t-lg`}
            >
              <Users className="w-4 h-4 mr-2" />
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`${
                activeTab === 'courses'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors rounded-t-lg`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`${
                activeTab === 'export'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors rounded-t-lg`}
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center transition-colors rounded-t-lg ml-auto`}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Security
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'students' && <StudentTab />}
          {activeTab === 'courses' && <CourseTab />}
          {activeTab === 'export' && <ExportTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
