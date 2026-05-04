"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import { Download, Loader2 } from 'lucide-react';

export default function ExportTab() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) {
        alert('No data to export.');
        setLoading(false);
        return;
      }

      const exportData = data.map(student => ({
        'Registration Date': new Date(student.created_at).toLocaleDateString(),
        'First Name': student.first_name,
        'Last Name': student.last_name,
        'Email': student.email,
        'Phone': student.phone,
        'Date of Birth': student.date_of_birth,
        'Gender': student.gender,
        'Address': student.address,
        'City': student.city,
        'Courses': student.selected_courses?.join(', ') || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
      
      XLSX.writeFile(workbook, `Student_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Failed to export data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden p-8 md:p-12 text-center max-w-2xl mx-auto relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-brand-orange)]"></div>
      
      <div className="flex justify-center mb-6 mt-4">
        <div className="p-5 bg-white/60 backdrop-blur-md rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-white">
          <Download className="w-10 h-10 text-[var(--color-brand-orange)]" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-[var(--color-brand-blue)] mb-3 uppercase tracking-wider">Export Student Data</h2>
      <p className="text-slate-600 font-bold mb-8">
        Download all student registrations as an Excel (.xlsx) file. This includes all personal details and selected courses.
      </p>
      
      <button 
        onClick={handleExport}
        disabled={loading}
        className="md-btn-primary w-full md:w-auto px-10 py-4 text-sm inline-flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Download className="w-5 h-5 mr-3" />}
        {loading ? 'PREPARING FILE...' : 'DOWNLOAD EXCEL REPORT'}
      </button>
    </div>
  );
}
