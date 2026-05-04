"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, User, Mail, Phone, MapPin, Building, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Course = {
  id: number;
  course_name: string;
};

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  selectedCourses: [] as string[],
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, course_name')
          .order('course_name', { ascending: true });

        if (error) {
          setFetchError('Could not load courses: ' + error.message);
        } else {
          setCourses(data ?? []);
        }
      } catch (e: any) {
        setFetchError('Network error: ' + e.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCourse = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(name)
        ? prev.selectedCourses.filter(c => c !== name)
        : [...prev.selectedCourses, name],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (formData.selectedCourses.length === 0) {
      setSubmitError('Please select at least one course.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('students').insert([{
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dob,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        selected_courses: formData.selectedCourses,
      }]);

      if (error) throw error;
      setSuccess(true);
      setFormData(INITIAL_FORM);
    } catch (err: any) {
      setSubmitError('Registration failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="glass-card p-10 max-w-md w-full text-center animate-in zoom-in duration-500">
          <CheckCircle2 className="w-24 h-24 text-[var(--color-brand-orange)] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[var(--color-brand-blue)] mb-3">Registration Successful!</h2>
          <p className="text-slate-600 mb-8 font-medium">We received your details and will be in touch shortly.</p>
          <button
            onClick={() => setSuccess(false)}
            className="md-btn-primary w-full py-4 text-lg"
          >
            Register Another Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-14 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Header with Logo */}
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="mb-6 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 inline-block overflow-hidden">
          <Image 
            src="/logo.jpg" 
            alt="DreamMore Logo" 
            width={160} 
            height={160} 
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-brand-blue)] tracking-tight mb-3">
          Student Registration
        </h1>
        <p className="text-[var(--color-brand-orange)] font-bold text-xl tracking-wide uppercase">
          Right work at right time
        </p>
      </div>

      {/* Main Glass Card Form */}
      <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 mb-20 relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-brand-orange)]"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2">

          {/* ─── Left column: Personal Info ─── */}
          <div className="space-y-6">
            <h3 className="text-[var(--color-brand-blue)] font-bold text-xl flex items-center gap-2 mb-6 uppercase tracking-wider border-b border-slate-200 pb-3">
              <User className="w-6 h-6 text-[var(--color-brand-orange)]" /> 
              Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange}
                  placeholder="John"
                  className="w-full md-input px-4 py-3" />
              </div>
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange}
                  placeholder="Doe"
                  className="w-full md-input px-4 py-3" />
              </div>
            </div>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full md-input pl-12 pr-4 py-3" />
              </div>
            </div>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+1 555 000-0000"
                  className="w-full md-input pl-12 pr-4 py-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">Date of Birth</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className="w-full md-input px-4 py-3" />
              </div>
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">Gender</label>
                <div className="relative">
                  <select required name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full md-input px-4 py-3 appearance-none cursor-pointer">
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right column: Location & Courses ─── */}
          <div className="space-y-6">
            <h3 className="text-[var(--color-brand-blue)] font-bold text-xl flex items-center gap-2 mb-6 uppercase tracking-wider border-b border-slate-200 pb-3">
              <MapPin className="w-6 h-6 text-[var(--color-brand-orange)]" /> 
              Location & Courses
            </h3>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">Address</label>
              <textarea required name="address" value={formData.address} onChange={handleChange}
                rows={2} placeholder="123 Main Street, Apt 4B"
                className="w-full md-input px-4 py-3 resize-none" />
            </div>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">City</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required name="city" value={formData.city} onChange={handleChange}
                  placeholder="New York"
                  className="w-full md-input pl-12 pr-4 py-3" />
              </div>
            </div>

            {/* ─── Courses ─── */}
            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-3">
                Select Courses <span className="text-slate-500 font-normal ml-1">(multiple allowed)</span>
              </label>

              <div className="glass-panel p-2 max-h-[200px] overflow-y-auto">
                {loading && (
                  <div className="flex flex-col items-center gap-3 py-6 text-slate-600">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-orange)]" />
                    <span className="font-bold">Loading courses...</span>
                  </div>
                )}

                {!loading && fetchError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-center font-bold text-sm">
                    {fetchError}
                  </div>
                )}

                {!loading && !fetchError && courses.length === 0 && (
                  <div className="text-slate-600 text-center py-6 font-bold">
                    No courses available yet.
                  </div>
                )}

                {!loading && !fetchError && (
                  <div className="grid grid-cols-1 gap-2">
                    {courses.map(course => {
                      const checked = formData.selectedCourses.includes(course.course_name);
                      return (
                        <label key={course.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 select-none ${
                            checked ? 'bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/50 shadow-sm' : 'bg-white/40 hover:bg-white/60 border border-transparent'
                          }`}>
                          
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[var(--color-brand-orange)] border-[var(--color-brand-orange)]' : 'bg-white border-slate-300'}`}>
                            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          
                          <span className={`text-sm font-bold ${checked ? 'text-[var(--color-brand-orange)]' : 'text-[var(--color-brand-blue)]'}`}>
                            {course.course_name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Submit ─── */}
          <div className="md:col-span-2 pt-6 mt-4">
            {submitError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 mb-6 font-bold shadow-sm">
                {submitError}
              </div>
            )}
            
            <button type="submit" disabled={submitting}
              className="md-btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> PROCESSING...</>
              ) : (
                'SUBMIT REGISTRATION'
              )}
            </button>
            <p className="text-center text-xs font-bold text-slate-500 mt-4 uppercase tracking-wider">
              Powered by DreamMore
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
