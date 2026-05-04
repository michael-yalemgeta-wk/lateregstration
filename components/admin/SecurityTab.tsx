"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Key, Loader2, CheckCircle2 } from 'lucide-react';

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      const { data: isValid, error: verifyError } = await supabase.rpc('verify_admin', {
        p_username: 'admin',
        p_password: currentPassword
      });

      if (verifyError || !isValid) {
        setMessage({ type: 'error', text: 'Current password is incorrect.' });
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.rpc('change_admin_password', {
        p_username: 'admin',
        p_new_password: newPassword
      });

      if (updateError) {
        setMessage({ type: 'error', text: 'Failed to update password. Did you run the updated SQL script?' });
      } else {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }

    } catch (err: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-brand-orange)]"></div>
      
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-white/60 backdrop-blur-md rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-white">
            <Shield className="w-8 h-8 text-[var(--color-brand-orange)]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--color-brand-blue)] uppercase tracking-wider">Security Settings</h2>
            <p className="text-slate-600 font-bold mt-1 text-sm uppercase tracking-wide">Manage your admin credentials securely</p>
          </div>
        </div>

        <div className="max-w-md">
          {message.text && (
            <div className={`p-4 mb-8 rounded-lg font-bold flex items-center gap-3 shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'}`}>
              {message.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[var(--color-brand-blue)] mb-1 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full md-input py-3 pl-12 pr-4"
                  required
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200/50">
              <label className="block text-xs font-bold text-[var(--color-brand-blue)] mb-1 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full md-input py-3 pl-12 pr-4"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-brand-blue)] mb-1 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full md-input py-3 pl-12 pr-4"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="md-btn-primary w-full flex items-center justify-center py-4 mt-8 text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
