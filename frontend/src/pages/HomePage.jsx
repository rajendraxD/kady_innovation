import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { formatCurrency } from '../utils/formatters';
import {
  Search,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Zap,
  Users,
  Brain,
  ClipboardCheck,
  CalendarCheck,
  Briefcase,
  MapPin,
  Clock,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   SECTIONS — the journey narrative. Maps directly to lets-scroll's section
   config: eyebrow, title, body, tags, accent colour, and a visual element.
───────────────────────────────────────────────────────────────────────────*/
const JOURNEY = [
  {
    id: 'discover',
    label: 'Discover',
    eyebrow: 'Step 01 — Find Your Role',
    title: 'A curated pipeline of\nhigh-impact careers.',
    body: 'Browse open positions across engineering, product, design, and data. Every listing is live, vetted, and attached to a real team.',
    tags: ['Engineering', 'Product', 'Data & AI', 'Design'],
    accent: '#70C100',
    icon: <Briefcase className="h-12 w-12" />,
    bg: 'from-[#70C100]/8 via-transparent to-transparent',
  },
  {
    id: 'apply',
    label: 'Apply',
    eyebrow: 'Step 02 — Apply in Seconds',
    title: 'Drop your résumé.\nWe fill the rest.',
    body: 'Our AI parser extracts your work history, skills, and education instantly. No copy-paste, no 20-minute form — one upload and you\'re done.',
    tags: ['AI Autofill', 'PDF Parsing', '< 2 Min'],
    accent: '#4ade80',
    icon: <Brain className="h-12 w-12" />,
    bg: 'from-emerald-500/8 via-transparent to-transparent',
  },
  {
    id: 'track',
    label: 'Track',
    eyebrow: 'Step 03 — Real-Time Visibility',
    title: 'Watch your application\nmove through the pipeline.',
    body: 'Every stage update is instant. You\'ll know exactly where you stand — no black holes, no silence.',
    tags: ['Live Status', 'Stage Alerts', 'Full History'],
    accent: '#60a5fa',
    icon: <ClipboardCheck className="h-12 w-12" />,
    bg: 'from-blue-500/8 via-transparent to-transparent',
  },
  {
    id: 'interview',
    label: 'Interview',
    eyebrow: 'Step 04 — Scheduled Automatically',
    title: 'Interview slots that\nfit around your life.',
    body: 'When you advance to an interview round, scheduling happens automatically. Video links, panel details, and prep notes — all in one place.',
    tags: ['Auto-Scheduling', 'Video Calls', 'Panel Brief'],
    accent: '#f59e0b',
    icon: <CalendarCheck className="h-12 w-12" />,
    bg: 'from-amber-500/8 via-transparent to-transparent',
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   useScrollProgress — tracks how far the user has scrolled 0 → 1
───────────────────────────────────────────────────────────────────────────*/
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handle = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  return progress;
};

/* ─────────────────────────────────────────────────────────────────────────
   useInView — IntersectionObserver for scroll-triggered entrance animations
───────────────────────────────────────────────────────────────────────────*/
const useInView = (opts = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: opts.threshold ?? 0.25, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

/* ─────────────────────────────────────────────────────────────────────────
   JourneySection — one step in the scroll narrative (lets-scroll "section")
───────────────────────────────────────────────────────────────────────────*/
const JourneySection = ({ section, index }) => {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      id={section.id}
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Accent glow backdrop — matches lets-scroll scene-background accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${section.bg} -z-0 pointer-events-none`}
      />

      {/* Section number track — the lets-scroll "route rail" equivalent */}
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-20 dark:opacity-15 select-none">
        <div className="w-px h-12 bg-current" />
        <span className="font-black text-[10px] rotate-90 tracking-[0.3em] text-gray-500 dark:text-gray-400 mt-2">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="w-px h-12 bg-current mt-2" />
      </div>

      <div className="mx-auto max-w-7xl px-8 sm:px-16 lg:px-24 w-full py-24">
        <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>

          {/* Visual Element — the lets-scroll "still" placeholder */}
          <div
            className={`shrink-0 flex items-center justify-center w-full max-w-sm lg:max-w-md transition-all duration-1000 ease-out
              ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
          >
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[2.5rem] flex items-center justify-center"
              style={{ background: `${section.accent}15`, border: `1.5px solid ${section.accent}25` }}
            >
              {/* Floating ring */}
              <div
                className="absolute inset-0 rounded-[2.5rem] animate-ping opacity-10"
                style={{ background: section.accent, animationDuration: '3s' }}
              />
              {/* Large section number watermark */}
              <span
                className="absolute text-[10rem] font-black opacity-[0.05] select-none leading-none"
                style={{ color: section.accent }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {/* Icon */}
              <div style={{ color: section.accent }} className="relative z-10">
                {section.icon}
              </div>
            </div>
          </div>

          {/* Copy Block — lets-scroll eyebrow + title + body + tags */}
          <div
            className={`flex-1 transition-all duration-1000 ease-out delay-200
              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase mb-5 border"
              style={{ color: section.accent, background: `${section.accent}12`, borderColor: `${section.accent}30` }}
            >
              {section.eyebrow}
            </span>

            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.12] whitespace-pre-line">
              {section.title}
            </h2>

            <p className="mt-5 text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
              {section.body}
            </p>

            {/* Tags — lets-scroll tag pills */}
            {section.tags?.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {section.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold border"
                    style={{ color: section.accent, background: `${section.accent}10`, borderColor: `${section.accent}25` }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   JobCard — featured job card with hover-lift effect
───────────────────────────────────────────────────────────────────────────*/
const JobCard = ({ job }) => (
  <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xs hover:border-[#70C100]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#4e8500] dark:text-[#84e000] uppercase tracking-wider">
            {job.department}
          </span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#4e8500] dark:group-hover:text-[#84e000] transition-colors mt-0.5">
            {job.title}
          </h3>
        </div>
        <span className="shrink-0 rounded-lg bg-[#70C100]/15 dark:bg-[#70C100]/15 px-2.5 py-1 text-xs font-semibold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
          {job.workplaceType}
        </span>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills?.slice(0, 4).map((skill, i) => (
          <span
            key={i}
            className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 text-xs font-medium text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        <span>{formatCurrency(job.salaryMin)} – {formatCurrency(job.salaryMax)} / yr</span>
      </div>
      <Link
        to={`/jobs/${job._id}`}
        className="inline-flex items-center gap-1 font-bold text-[#4e8500] dark:text-[#84e000] group-hover:translate-x-0.5 transition-transform"
      >
        <span>View Role</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   MetricItem — stats bar item
───────────────────────────────────────────────────────────────────────────*/
const MetricItem = ({ value, label, accent = false }) => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <p className={`text-3xl sm:text-4xl font-black ${accent ? 'text-[#60A500] dark:text-[#88E505]' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
      <p className="mt-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   HomePage
───────────────────────────────────────────────────────────────────────────*/
export const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const progress = useScrollProgress();
  const [activeSection, setActiveSection] = useState(null);
  const [heroInView, setHeroInView] = useState(true);
  const [jobsRef, jobsInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    jobApi.getJobs({ limit: 4, status: 'active' })
      .then((res) => setFeaturedJobs(res.data.jobs || []))
      .catch(console.error)
      .finally(() => setLoadingJobs(false));
  }, []);

  // Track active section for nav dots
  useEffect(() => {
    const observers = JOURNEY.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Hero visibility for scroll hint
  useEffect(() => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;
    const obs = new IntersectionObserver(([e]) => setHeroInView(e.isIntersecting), { threshold: 0.1 });
    obs.observe(heroEl);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative">

      {/* ── Scroll progress bar — lets-scroll sw-scrollbar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#70C100] to-[#84e000] transition-all duration-75"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* ── Section nav rail — lets-scroll sw-route ── */}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 hidden lg:flex">
        {JOURNEY.map((s) => (
          <button
            key={s.id}
            type="button"
            title={s.label}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative flex items-center justify-end gap-2 cursor-pointer"
          >
            {/* Label tooltip */}
            <span className="absolute right-6 whitespace-nowrap rounded-lg bg-gray-900 dark:bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-white dark:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {s.label}
            </span>
            {/* Dot */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeSection === s.id
                  ? 'w-2.5 h-2.5 bg-[#70C100]'
                  : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-400'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-8 pb-16"
      >
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#70C100]/25 via-lime-400/10 to-emerald-400/20 blur-3xl -z-10 rounded-full dark:opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[200px] bg-gradient-to-tl from-emerald-500/15 to-transparent blur-2xl -z-10 rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-300 dark:border-lime-900/50 bg-lime-50/80 dark:bg-lime-950/40 px-4 py-1.5 text-xs font-bold text-[#5B9B00] dark:text-[#88E505] shadow-2xs mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Next-Gen Enterprise Recruitment Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Your next career move
            <br />
            <span className="bg-gradient-to-r from-[#4e8500] via-[#70C100] to-[#84e000] bg-clip-text text-transparent">
              starts here.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            AI-powered resume parsing, real-time pipeline tracking, and automated interview
            scheduling — a recruitment experience built for people, not processes.
          </p>

          {/* Search box */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white dark:bg-gray-900 p-2.5 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100/90 dark:border-gray-800 flex flex-col sm:flex-row gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search role, skill, or department..."
                className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-gray-800 dark:text-gray-100 focus:outline-hidden placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    window.location.href = `/jobs?search=${encodeURIComponent(e.target.value)}`;
                }}
              />
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-6 py-3.5 text-sm font-black text-black shadow-md shadow-[#70C100]/25 active:scale-95 transition-all cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Browse Open Roles
            </Link>
          </div>

          {/* Popular tags */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 animate-in fade-in duration-700 delay-500">
            <span className="text-gray-400 dark:text-gray-500">Popular:</span>
            {['Engineering', 'Product & Design', 'Data & AI', 'Full Stack', 'Remote'].map((tag) => (
              <Link
                key={tag}
                to={`/jobs?search=${encodeURIComponent(tag)}`}
                className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-[#70C100]/15 hover:text-[#4e8500] dark:hover:text-[#84e000] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll hint — lets-scroll sw-hint */}
        <button
          type="button"
          onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-gray-400 dark:text-gray-600 hover:text-[#70C100] dark:hover:text-[#70C100] transition-all duration-500 ${heroInView ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]">scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </section>

      {/* ── METRICS BAR ── */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <MetricItem value="98%" label="Candidate Satisfaction" accent />
            <MetricItem value="< 2 Min" label="Average Apply Time" />
            <MetricItem value="AI Powered" label="Resume Autofill" accent />
            <MetricItem value="100%" label="Transparent Tracking" />
          </div>
        </div>
      </section>

      {/* ── SCROLL JOURNEY — lets-scroll sections ── */}
      {JOURNEY.map((section, i) => (
        <JourneySection key={section.id} section={section} index={i} />
      ))}

      {/* Divider between journey and jobs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      </div>

      {/* ── FEATURED OPENINGS ── */}
      <section ref={jobsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 transition-all duration-700 ${
            jobsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4e8500] dark:text-[#84e000]">
              Opportunities
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
              Featured Job Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4e8500] dark:text-[#84e000] hover:underline"
          >
            <span>View All Requisitions</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="space-y-2 w-3/4">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA / FINALE — lets-scroll last section cta ── */}
      <section ref={ctaRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div
          className={`rounded-3xl bg-gradient-to-tr from-gray-950 via-gray-900 to-black p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-gray-800 transition-all duration-1000 ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Glow accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#70C100]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/8 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#70C100]/20 px-3 py-1 text-xs font-bold text-[#84e000] border border-[#70C100]/30 mb-5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Zero-Friction Candidate Experience</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
              Apply in seconds with
              <br />
              <span className="text-[#84e000]">intelligent resume parsing.</span>
            </h3>

            <p className="mt-5 text-sm text-gray-300 leading-relaxed max-w-lg">
              No need to spend 20 minutes copying your work history. Drop your PDF and our
              AI extracts your experience, education, and skills instantly — ready to submit.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/jobs"
                className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-6 py-3.5 text-sm font-black text-black shadow-lg shadow-[#70C100]/25 active:scale-95 transition-all cursor-pointer"
              >
                Explore All Open Positions
              </Link>
              <Link
                to="/track-status"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                Track Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
