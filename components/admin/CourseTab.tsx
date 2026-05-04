"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Edit, Save, X, Plus, Loader2, Layers } from 'lucide-react';

export default function CourseTab() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Single Add state
  const [newCourse, setNewCourse] = useState('');
  
  // Bulk Add state
  const [bulkCourses, setBulkCourses] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select('*').order('id', { ascending: true });
    if (error) console.error('Error fetching courses:', error);
    else setCourses(data || []);
    setLoading(false);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.trim()) return;
    
    const { error } = await supabase.from('courses').insert([{ course_name: newCourse.trim() }]);
    if (error) alert('Error adding course: ' + error.message);
    else {
      setNewCourse('');
      fetchCourses();
    }
  };

  const handleBulkAdd = async () => {
    const coursesArray = bulkCourses.split('\n').map(c => c.trim()).filter(c => c.length > 0);
    if (coursesArray.length === 0) return;

    const insertData = coursesArray.map(c => ({ course_name: c }));
    
    const { error } = await supabase.from('courses').insert(insertData);
    if (error) alert('Error bulk adding courses: ' + error.message);
    else {
      setBulkCourses('');
      setShowBulk(false);
      fetchCourses();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this course? It might be linked to existing students.')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else fetchCourses();
  };

  const handleEditClick = (course: any) => {
    setEditingId(course.id);
    setEditName(course.course_name);
  };

  const handleSave = async (id: number) => {
    const { error } = await supabase.from('courses').update({ course_name: editName }).eq('id', id);
    if (error) alert('Error updating: ' + error.message);
    else {
      setEditingId(null);
      fetchCourses();
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <form onSubmit={handleAddCourse} className="flex-1 flex gap-2 w-full">
            <input 
              type="text" 
              value={newCourse} 
              onChange={e => setNewCourse(e.target.value)}
              placeholder="Enter new course name"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Add Course
            </button>
          </form>
          <button 
            onClick={() => setShowBulk(!showBulk)}
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg flex items-center font-medium transition-colors border border-indigo-100"
          >
            <Layers className="w-4 h-4 mr-2" /> {showBulk ? 'Cancel Bulk Add' : 'Bulk Add'}
          </button>
        </div>

        {showBulk && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-medium text-slate-700 mb-2">Paste multiple courses (one per line):</label>
            <textarea 
              value={bulkCourses}
              onChange={e => setBulkCourses(e.target.value)}
              rows={5}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3 resize-none"
              placeholder="Mathematics 101&#10;Physics 202&#10;Computer Science 303"
            />
            <div className="flex justify-end">
              <button onClick={handleBulkAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Save All Courses
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold w-16 text-center">ID</th>
              <th className="p-4 font-semibold">Course Name</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {courses.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">No courses available.</td></tr>
            ) : courses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-center text-slate-400 text-sm">{course.id}</td>
                {editingId === course.id ? (
                  <>
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        className="border border-slate-300 px-3 py-1.5 w-full max-w-md rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                        autoFocus
                      />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleSave(course.id)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full"><Save className="w-5 h-5" /></button>
                      <button onClick={() => setEditingId(null)} className="text-slate-500 hover:bg-slate-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium text-slate-800">{course.course_name}</td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => handleEditClick(course)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
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
