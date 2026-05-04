"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit, Save, X, Loader2, UploadCloud } from 'lucide-react';

export default function CourseTab() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState('');
  const [bulkCourses, setBulkCourses] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching courses:', error);
    else setCourses(data || []);
    setLoading(false);
  };

  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.trim()) return;
    const { error } = await supabase.from('courses').insert([{ course_name: newCourse.trim() }]);
    if (error) alert('Error: ' + error.message);
    else {
      setNewCourse('');
      fetchCourses();
    }
  };

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCourses.trim()) return;
    const courseNames = bulkCourses.split('\n').map(c => c.trim()).filter(c => c);
    const inserts = courseNames.map(name => ({ course_name: name }));
    const { error } = await supabase.from('courses').insert(inserts);
    if (error) alert('Error bulk adding: ' + error.message);
    else {
      setBulkCourses('');
      fetchCourses();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else fetchCourses();
  };

  const handleEditClick = (course: any) => {
    setEditingId(course.id);
    setEditName(course.course_name);
  };

  const handleSave = async (id: number) => {
    if (!editName.trim()) return;
    const { error } = await supabase.from('courses').update({ course_name: editName }).eq('id', id);
    if (error) alert('Error updating: ' + error.message);
    else {
      setEditingId(null);
      fetchCourses();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Add Forms */}
      <div className="lg:col-span-1 space-y-8">
        {/* Single Add */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-brand-orange)]"></div>
          <h3 className="text-lg font-black text-[var(--color-brand-blue)] mb-6 flex items-center gap-2 uppercase tracking-wide">
            <Plus className="w-5 h-5 text-[var(--color-brand-orange)]" />
            Add Course
          </h3>
          <form onSubmit={handleAddSingle} className="space-y-4">
            <input 
              type="text" 
              value={newCourse} 
              onChange={e => setNewCourse(e.target.value)} 
              placeholder="e.g. Graphic Design"
              className="w-full md-input py-3 px-4"
            />
            <button type="submit" className="md-btn-primary w-full py-3 text-sm">
              ADD COURSE
            </button>
          </form>
        </div>

        {/* Bulk Add */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-brand-orange)]"></div>
          <h3 className="text-lg font-black text-[var(--color-brand-blue)] mb-2 flex items-center gap-2 uppercase tracking-wide">
            <UploadCloud className="w-5 h-5 text-[var(--color-brand-orange)]" />
            Bulk Add
          </h3>
          <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">Enter one course name per line</p>
          <form onSubmit={handleBulkAdd} className="space-y-4">
            <textarea 
              value={bulkCourses} 
              onChange={e => setBulkCourses(e.target.value)} 
              rows={5}
              placeholder="Course 1&#10;Course 2&#10;Course 3"
              className="w-full md-input py-3 px-4 resize-none"
            />
            <button type="submit" className="md-btn-secondary w-full py-3 text-sm">
              BULK IMPORT
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Course List */}
      <div className="lg:col-span-2">
        <div className="glass-card overflow-hidden p-6 md:p-8 h-full">
          <h3 className="text-xl font-black text-[var(--color-brand-blue)] mb-6 uppercase tracking-wide border-b border-slate-200 pb-3">Course Catalog</h3>
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-[var(--color-brand-orange)] w-10 h-10" />
            </div>
          ) : (
            <div className="space-y-3">
              {courses.length === 0 ? (
                <div className="text-center p-10 bg-white/40 rounded-xl border-2 border-dashed border-slate-300">
                  <p className="text-slate-600 font-bold uppercase tracking-wider">No courses available</p>
                </div>
              ) : courses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-white/60 hover:bg-white transition-all rounded-lg shadow-sm border-2 border-[#cbd5e1] hover:border-[var(--color-brand-orange)]">
                  {editingId === course.id ? (
                    <div className="flex items-center gap-3 w-full">
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        className="flex-1 md-input px-3 py-1.5"
                        autoFocus
                      />
                      <button onClick={() => handleSave(course.id)} className="p-2 bg-emerald-100 text-emerald-700 rounded shadow-sm hover:bg-emerald-200"><Save className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-700 rounded shadow-sm hover:bg-slate-300"><X className="w-5 h-5" /></button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-brand-orange)] shadow-[0_0_8px_rgba(230,126,34,0.8)]"></div>
                        <span className="font-bold text-[var(--color-brand-blue)] text-lg">{course.course_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(course)} className="p-2 bg-slate-100 text-[var(--color-brand-blue)] rounded shadow-sm hover:bg-slate-200 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(course.id)} className="p-2 bg-red-50 text-red-600 rounded shadow-sm hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
