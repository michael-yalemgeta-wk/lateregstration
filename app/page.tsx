"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, User, Mail, Phone, MapPin, Building, GraduationCap, Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-5" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Registration Successful!</h2>
          <p className="text-gray-500 mb-8">We received your details and will be in touch shortly.</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Register Another Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-14 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/40 mb-4">
          <GraduationCap className="w-7 h-7 text-indigo-300" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 mb-3">
          Academy Portal
        </h1>
        <p className="text-indigo-200/70 text-lg">Join our world-class learning platform today.</p>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Top color bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ─── Left column: Personal Info ─── */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-white/10 pb-2">
              <User className="w-5 h-5 text-indigo-400" /> Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-indigo-200 text-sm font-medium block mb-1">First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange}
                  placeholder="John"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="text-indigo-200 text-sm font-medium block mb-1">Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>

            <div>
              <label className="text-indigo-200 text-sm font-medium block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>

            <div>
              <label className="text-indigo-200 text-sm font-medium block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+1 555 000-0000"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-indigo-200 text-sm font-medium block mb-1">Date of Birth</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-indigo-200 text-sm font-medium block mb-1">Gender</label>
                <select required name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── Right column: Location & Courses ─── */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-lg flex items-center gap-2 border-b border-white/10 pb-2">
              <MapPin className="w-5 h-5 text-indigo-400" /> Location & Courses
            </h3>

            <div>
              <label className="text-indigo-200 text-sm font-medium block mb-1">Address</label>
              <textarea required name="address" value={formData.address} onChange={handleChange}
                rows={2} placeholder="123 Main Street, Apt 4B"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
            </div>

            <div>
              <label className="text-indigo-200 text-sm font-medium block mb-1">City</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                <input required name="city" value={formData.city} onChange={handleChange}
                  placeholder="New York"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>

            {/* ─── Courses ─── */}
            <div>
              <label className="text-indigo-200 text-sm font-medium block mb-2">
                Select Courses <span className="text-slate-400">(multiple allowed)</span>
              </label>

              <div className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-3 max-h-52 overflow-y-auto space-y-1">
                {loading && (
                  <div className="flex items-center gap-2 py-4 justify-center text-indigo-300">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading courses...</span>
                  </div>
                )}

                {!loading && fetchError && (
                  <p className="text-red-400 text-sm text-center py-4">{fetchError}</p>
                )}

                {!loading && !fetchError && courses.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-4">
                    No courses yet. Add them in the Admin panel.
                  </p>
                )}

                {!loading && !fetchError && courses.map(course => {
                  const checked = formData.selectedCourses.includes(course.course_name);
                  return (
                    <label key={course.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        checked ? 'bg-indigo-600/30 border border-indigo-500/40' : 'hover:bg-slate-800/50 border border-transparent'
                      }`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        checked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'
                      }`}>
                        {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input type="checkbox" className="sr-only"
                        checked={checked}
                        onChange={() => toggleCourse(course.course_name)} />
                      <span className="text-sm text-slate-200 font-medium">{course.course_name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Submit ─── */}
          <div className="md:col-span-2 pt-6 border-t border-white/10">
            {submitError && (
              <p className="text-red-300 text-sm text-center mb-4">{submitError}</p>
            )}
            <button type="submit" disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2">
              {submitting
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                : 'Complete Registration'}
            </button>
            <p className="text-center text-xs text-slate-500 mt-3">
              By registering, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
