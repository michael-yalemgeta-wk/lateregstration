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

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email & Phone</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Courses</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No registrations found.</td></tr>
            ) : students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                {editingId === student.id ? (
                  <>
                    <td className="p-4">
                      <input type="text" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} className="border p-1 w-full mb-1 text-sm rounded" />
                      <input type="text" value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} className="border p-1 w-full text-sm rounded" />
                    </td>
                    <td className="p-4">
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="border p-1 w-full mb-1 text-sm rounded" />
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="border p-1 w-full text-sm rounded" />
                    </td>
                    <td className="p-4">
                      <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="border p-1 w-full text-sm rounded" />
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      Cannot edit courses here.
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleSave(student.id)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full"><Save className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{student.first_name} {student.last_name}</div>
                      <div className="text-xs text-slate-500">{student.gender} • {student.date_of_birth}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-800">{student.email}</div>
                      <div className="text-sm text-slate-500">{student.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-800">{student.city}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">{student.address}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {student.selected_courses?.map((c: string, i: number) => (
                          <span key={i} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => handleEditClick(student)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
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
