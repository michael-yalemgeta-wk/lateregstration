"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import { Download, Loader2, FileSpreadsheet } from 'lucide-react';

export default function ExportTab() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all students
      const { data: students, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      
      if (error) throw error;
      if (!students || students.length === 0) {
        alert('No data to export.');
        setLoading(false);
        return;
      }

      // Format data for Excel
      const excelData = students.map((s: any) => ({
        'ID': s.id,
        'First Name': s.first_name,
        'Last Name': s.last_name,
        'Email': s.email,
        'Phone': s.phone,
        'Date of Birth': s.date_of_birth,
        'Gender': s.gender,
        'Address': s.address,
        'City': s.city,
        'Selected Courses': s.selected_courses ? s.selected_courses.join(', ') : '',
        'Registration Date': new Date(s.created_at).toLocaleString()
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

      // Download file
      XLSX.writeFile(workbook, `student_registrations_${new Date().toISOString().split('T')[0]}.xlsx`);

    } catch (err: any) {
      console.error('Export error:', err);
      alert('Error exporting data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl mx-auto mt-10">
      <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-6">
        <FileSpreadsheet className="w-12 h-12 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Export Student Data</h2>
      <p className="text-slate-600 mb-8">
        Download a complete list of all registered students, including their personal details, contact information, and selected courses in Excel (.xlsx) format.
      </p>
      
      <button 
        onClick={handleExport}
        disabled={loading}
        className={`inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Preparing Download...</>
        ) : (
          <><Download className="w-5 h-5 mr-2" /> Download Excel File</>
        )}
      </button>
    </div>
  );
}
