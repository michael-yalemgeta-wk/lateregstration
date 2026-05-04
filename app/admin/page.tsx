"use client";

import { useState } from 'react';
import StudentTab from '@/components/admin/StudentTab';
import CourseTab from '@/components/admin/CourseTab';
import ExportTab from '@/components/admin/ExportTab';
import { Users, BookOpen, DownloadCloud, Lock, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'export'>('students');

  const handleLogout = () => {
    alert("Passcode protection is currently disabled for testing.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-slate-700 flex items-center text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage student registrations, courses, and data exports.</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('students')}
              className={`${
                activeTab === 'students'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <Users className="w-4 h-4 mr-2" />
              Student Registrations
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`${
                activeTab === 'courses'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Course Management
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`${
                activeTab === 'export'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {activeTab === 'students' && <StudentTab />}
          {activeTab === 'courses' && <CourseTab />}
          {activeTab === 'export' && <ExportTab />}
        </div>
      </div>
    </div>
  );
}
