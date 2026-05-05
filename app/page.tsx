"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, User, Mail, Phone, MapPin, Building, Loader2, Globe } from 'lucide-react';
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

const TRANSLATIONS = {
  en: {
    title: "Student Registration",
    subtitle: "Right work at right time",
    personalDetails: "Personal Details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    dob: "Date of Birth",
    gender: "Gender",
    select: "Select",
    male: "Male",
    female: "Female",
    other: "Other",
    locationCourses: "Location & Courses",
    address: "Address",
    city: "City",
    selectCourses: "Select Courses",
    multipleAllowed: "(multiple allowed)",
    loading: "Loading courses...",
    noCourses: "No courses available yet.",
    submit: "SUBMIT REGISTRATION",
    processing: "PROCESSING...",
    poweredBy: "Powered by DreamMore",
    successTitle: "Registration Successful!",
    successMsg: "We received your details and will be in touch shortly.",
    registerAnother: "Register Another Student",
    placeholderFirst: "Abebe",
    placeholderLast: "Kebede",
    placeholderAddress: "Bole, Addis Ababa",
    placeholderCity: "Addis Ababa"
  },
  am: {
    title: "የተማሪ ምዝገባ",
    subtitle: "ትክክለኛ ስራ በትክክለኛ ጊዜ",
    personalDetails: "የግል መረጃ",
    firstName: "ስም",
    lastName: "የአባት ስም",
    email: "የኢሜይል አድራሻ",
    phone: "ስልክ ቁጥር",
    dob: "የትውልድ ቀን",
    gender: "ጾታ",
    select: "ምረጥ",
    male: "ወንድ",
    female: "ሴት",
    other: "ሌላ",
    locationCourses: "አድራሻ እና ኮርሶች",
    address: "አድራሻ",
    city: "ከተማ",
    selectCourses: "ኮርሶችን ይምረጡ",
    multipleAllowed: "(ከአንድ በላይ መምረጥ ይቻላል)",
    loading: "ኮርሶችን በማምጣት ላይ...",
    noCourses: "ምንም ኮርሶች የሉም።",
    submit: "ምዝገባውን አረጋግጥ",
    processing: "በማስኬድ ላይ...",
    poweredBy: "በ DreamMore የተዘጋጀ",
    successTitle: "ምዝገባዎ ተሳክቷል!",
    successMsg: "መረጃዎትን ተቀብለናል፣ በቅርቡ እናገኝዎታለን።",
    registerAnother: "ሌላ ተማሪ ያስመዝግቡ",
    placeholderFirst: "አበበ",
    placeholderLast: "ከበደ",
    placeholderAddress: "ቦሌ፣ አዲስ አበባ",
    placeholderCity: "አዲስ አበባ"
  }
};

export default function Home() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const t = TRANSLATIONS[lang];

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
      setSubmitError(lang === 'en' ? 'Please select at least one course.' : 'እባክዎ ቢያንስ አንድ ኮርስ ይምረጡ።');
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
      setSubmitError((lang === 'en' ? 'Registration failed: ' : 'ምዝገባው አልተሳካም: ') + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'am' : 'en');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="glass-card p-10 max-w-md w-full text-center animate-in zoom-in duration-500">
          <CheckCircle2 className="w-24 h-24 text-[var(--color-brand-orange)] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[var(--color-brand-blue)] mb-3">{t.successTitle}</h2>
          <p className="text-slate-600 mb-8 font-medium">{t.successMsg}</p>
          <button
            onClick={() => setSuccess(false)}
            className="md-btn-primary w-full py-4 text-lg"
          >
            {t.registerAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Language Toggle */}
      <div className="max-w-4xl mx-auto flex justify-end mb-6">
        <button 
          onClick={toggleLanguage}
          className="md-btn-secondary flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm hover:bg-white"
        >
          <Globe className="w-4 h-4" />
          {lang === 'en' ? 'አማርኛ' : 'English'}
        </button>
      </div>

      {/* Header with Logo */}
      <div className="text-center mb-10 flex flex-col items-center">
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
          {t.title}
        </h1>
        <p className="text-[var(--color-brand-orange)] font-bold text-xl tracking-wide uppercase">
          {t.subtitle}
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
              {t.personalDetails}
            </h3>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.firstName}</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange}
                  placeholder={t.placeholderFirst}
                  className="w-full md-input px-4 py-3" />
              </div>
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.lastName}</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange}
                  placeholder={t.placeholderLast}
                  className="w-full md-input px-4 py-3" />
              </div>
            </div>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="abebe@example.com"
                  className="w-full md-input pl-12 pr-4 py-3" />
              </div>
            </div>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.phone}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="+251 911 000000"
                  className="w-full md-input pl-12 pr-4 py-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.dob}</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className="w-full md-input px-4 py-3" />
              </div>
              <div>
                <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.gender}</label>
                <div className="relative">
                  <select required name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full md-input px-4 py-3 appearance-none cursor-pointer">
                    <option value="" disabled>{t.select}</option>
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
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
              {t.locationCourses}
            </h3>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.address}</label>
              <textarea required name="address" value={formData.address} onChange={handleChange}
                rows={2} placeholder={t.placeholderAddress}
                className="w-full md-input px-4 py-3 resize-none" />
            </div>

            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-1">{t.city}</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input required name="city" value={formData.city} onChange={handleChange}
                  placeholder={t.placeholderCity}
                  className="w-full md-input pl-12 pr-4 py-3" />
              </div>
            </div>

            {/* ─── Courses ─── */}
            <div>
              <label className="text-[var(--color-brand-blue)] text-sm font-bold block mb-3">
                {t.selectCourses} <span className="text-slate-500 font-normal ml-1">{t.multipleAllowed}</span>
              </label>

              <div className="glass-panel p-2 max-h-[200px] overflow-y-auto">
                {loading && (
                  <div className="flex flex-col items-center gap-3 py-6 text-slate-600">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-orange)]" />
                    <span className="font-bold">{t.loading}</span>
                  </div>
                )}

                {!loading && fetchError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-center font-bold text-sm">
                    {fetchError}
                  </div>
                )}

                {!loading && !fetchError && courses.length === 0 && (
                  <div className="text-slate-600 text-center py-6 font-bold">
                    {t.noCourses}
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
                          
                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={checked} 
                            onChange={() => toggleCourse(course.course_name)} 
                          />

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
                <><Loader2 className="w-6 h-6 animate-spin" /> {t.processing}</>
              ) : (
                t.submit
              )}
            </button>
            <p className="text-center text-xs font-bold text-slate-500 mt-4 uppercase tracking-wider">
              {t.poweredBy}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
