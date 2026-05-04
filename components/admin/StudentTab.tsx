"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit, Save, X, Loader2 } from 'lucide-react';

export default function StudentTab() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching students:', error);
    else setStudents(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else fetchStudents();
  };

  const handleEditClick = (student: any) => {
    setEditingId(student.id);
    setEditForm(student);
  };

  const handleSave = async (id: number) => {
    const { error } = await supabase.from('students').update(editForm).eq('id', id);
    if (error) alert('Error updating: ' + error.message);
    else {
      setEditingId(null);
      fetchStudents();
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[var(--color-brand-orange)] w-12 h-12" /></div>;

  return (
    <div className="glass-card overflow-hidden p-6 md:p-8">
      <div className="overflow-x-auto rounded-xl bg-white/50 border border-slate-200/50 shadow-sm backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/80 border-b-2 border-slate-300 text-[var(--color-brand-blue)] text-xs uppercase tracking-wider font-bold">
              <th className="p-4">Name</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Location</th>
              <th className="p-4">Courses</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {students.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-slate-500 font-bold uppercase tracking-wider text-sm">No registrations found.</td></tr>
            ) : students.map((student) => (
              <tr key={student.id} className="transition-colors hover:bg-white/60">
                {editingId === student.id ? (
                  <>
                    <td className="p-4">
                      <input type="text" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} className="md-input p-2 w-full mb-2 text-sm" />
                      <input type="text" value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} className="md-input p-2 w-full text-sm" />
                    </td>
                    <td className="p-4">
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="md-input p-2 w-full mb-2 text-sm" />
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="md-input p-2 w-full text-sm" />
                    </td>
                    <td className="p-4">
                      <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="md-input p-2 w-full text-sm" />
                    </td>
                    <td className="p-4 text-xs font-bold text-[var(--color-brand-orange)] uppercase tracking-wider">
                      Cannot edit courses here.
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleSave(student.id)} className="p-2 bg-emerald-100 text-emerald-700 rounded shadow hover:bg-emerald-200"><Save className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-700 rounded shadow hover:bg-slate-300"><X className="w-5 h-5" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">
                      <div className="font-bold text-[var(--color-brand-blue)] text-base">{student.first_name} {student.last_name}</div>
                      <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider bg-white/80 inline-block px-2 py-0.5 rounded shadow-sm border border-slate-200/50">{student.gender}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-[var(--color-brand-blue)]">{student.email}</div>
                      <div className="text-xs font-bold text-slate-600 mt-1 tracking-wide">{student.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-[var(--color-brand-blue)] uppercase tracking-wide">{student.city}</div>
                      <div className="text-xs font-medium text-slate-500 mt-1 truncate max-w-[150px]">{student.address}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {student.selected_courses?.map((c: string, i: number) => (
                          <span key={i} className="bg-[var(--color-brand-blue)] text-white font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded shadow-sm">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditClick(student)} className="p-2 bg-white text-[var(--color-brand-blue)] rounded shadow hover:bg-slate-50 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 bg-white text-red-600 rounded shadow hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
