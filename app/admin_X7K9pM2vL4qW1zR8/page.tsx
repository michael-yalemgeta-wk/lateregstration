"use client";

import { useState } from 'react';
import StudentTab from '@/components/admin/StudentTab';
import CourseTab from '@/components/admin/CourseTab';
import ExportTab from '@/components/admin/ExportTab';
import SecurityTab from '@/components/admin/SecurityTab';
import { Users, BookOpen, DownloadCloud, Lock, LogOut, Loader2, User, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        
        <div className="mb-6 bg-white p-3 rounded-[20px] shadow-lg border border-slate-100 inline-block overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Image 
            src="/logo.jpg" 
            alt="DreamMore Logo" 
            width={100} 
            height={100} 
            className="object-contain"
            priority
          />
        </div>

        <div className="glass-card p-10 max-w-md w-full animate-in zoom-in duration-500 delay-150 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-brand-blue)]"></div>

          <div className="flex justify-center mb-6 mt-2">
            <div className="p-4 bg-[var(--color-brand-blue)]/10 rounded-full">
              <ShieldCheck className="w-10 h-10 text-[var(--color-brand-blue)]" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-center text-[var(--color-brand-blue)] mb-1 uppercase tracking-tight">Secure Portal</h1>
          <p className="text-center text-slate-600 font-bold mb-8 uppercase text-xs tracking-widest">DreamMore Administration</p>
          
          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r shadow-sm text-sm font-bold">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[var(--color-brand-blue)] mb-1 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full md-input py-3 pl-10 pr-4"
                  placeholder="Enter username"
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-brand-blue)] mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full md-input py-3 pl-10 pr-4"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="md-btn-primary w-full flex items-center justify-center py-4 mt-8"
            >
              {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
              {isLoggingIn ? 'VERIFYING...' : 'SECURE LOGIN'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      {/* Top Navigation */}
      <nav className="glass-card sticky top-0 z-20 m-4 mb-8 rounded-[16px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="bg-white p-1 rounded-lg">
                <Image 
                  src="/logo.jpg" 
                  alt="Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black text-[var(--color-brand-blue)] hidden sm:block uppercase tracking-wider">DreamMore</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-600 hidden md:block">
                Admin: <span className="text-[var(--color-brand-orange)] uppercase">admin</span>
              </span>
              <button 
                onClick={handleLogout}
                className="md-btn-secondary px-4 py-2 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" /> LOGOUT
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-black text-[var(--color-brand-blue)] uppercase tracking-tight">Dashboard Console</h1>
          <p className="mt-2 text-lg font-bold text-slate-600">Manage student registrations, courses, and system security.</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
          <button
            onClick={() => setActiveTab('students')}
            className={`whitespace-nowrap py-3 px-6 text-sm flex items-center transition-all flex-1 justify-center rounded-lg font-bold uppercase tracking-wider ${
              activeTab === 'students' ? 'bg-[var(--color-brand-blue)] text-white shadow-md' : 'bg-white/50 text-slate-600 hover:bg-white border border-transparent hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" /> Registrations
          </button>
          
          <button
            onClick={() => setActiveTab('courses')}
            className={`whitespace-nowrap py-3 px-6 text-sm flex items-center transition-all flex-1 justify-center rounded-lg font-bold uppercase tracking-wider ${
              activeTab === 'courses' ? 'bg-[var(--color-brand-blue)] text-white shadow-md' : 'bg-white/50 text-slate-600 hover:bg-white border border-transparent hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Courses
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`whitespace-nowrap py-3 px-6 text-sm flex items-center transition-all flex-1 justify-center rounded-lg font-bold uppercase tracking-wider ${
              activeTab === 'export' ? 'bg-[var(--color-brand-blue)] text-white shadow-md' : 'bg-white/50 text-slate-600 hover:bg-white border border-transparent hover:border-slate-300'
            }`}
          >
            <DownloadCloud className="w-4 h-4 mr-2" /> Export
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-3 px-6 text-sm flex items-center transition-all flex-1 justify-center rounded-lg font-bold uppercase tracking-wider ${
              activeTab === 'security' ? 'bg-[var(--color-brand-blue)] text-white shadow-md' : 'bg-white/50 text-slate-600 hover:bg-white border border-transparent hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          {activeTab === 'students' && <StudentTab />}
          {activeTab === 'courses' && <CourseTab />}
          {activeTab === 'export' && <ExportTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
