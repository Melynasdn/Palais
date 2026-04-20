import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation, Volume2, VolumeX, Sun, Moon, Clock, MapPin, Heart, Users, Wine, UtensilsCrossed, Music, Send } from 'lucide-react';

import fleur from './assets/fleur.jpg';
import './App.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const THEMES = {
  light: {
    '--bg-primary': '#FAF7F2',
    '--bg-secondary': '#F3EDE4',
    '--bg-card': 'rgba(255,255,255,0.92)',
    '--bg-card-solid': '#FFFFFF',
    '--text-primary': '#2C1810',
    '--text-secondary': '#6B5B4F',
    '--text-muted': '#9B8B7F',
    '--gold': '#B8860B',
    '--gold-light': 'rgba(184,134,11,0.12)',
    '--gold-glow': 'rgba(184,134,11,0.25)',
    '--border': 'rgba(184,134,11,0.18)',
    '--border-subtle': 'rgba(44,24,16,0.07)',
    '--shadow-sm': '0 2px 8px rgba(44,24,16,0.06)',
    '--shadow-md': '0 8px 32px rgba(44,24,16,0.08)',
    '--shadow-lg': '0 16px 48px rgba(44,24,16,0.12)',
    '--hero-overlay': 'linear-gradient(180deg, rgba(250,247,242,0) 0%, rgba(250,247,242,0.15) 50%, rgba(250,247,242,0.92) 100%)',
    '--hero-overlay-top': 'linear-gradient(180deg, rgba(250,247,242,0.5) 0%, rgba(250,247,242,0) 30%)',
  },
  dark: {
    '--bg-primary': '#08080D',
    '--bg-secondary': '#0F0F17',
    '--bg-card': 'rgba(22,22,32,0.92)',
    '--bg-card-solid': '#16161F',
    '--text-primary': '#F0EBE3',
    '--text-secondary': '#B0A79D',
    '--text-muted': '#6A6058',
    '--gold': '#D4A849',
    '--gold-light': 'rgba(212,168,73,0.10)',
    '--gold-glow': 'rgba(212,168,73,0.20)',
    '--border': 'rgba(212,168,73,0.15)',
    '--border-subtle': 'rgba(240,235,227,0.05)',
    '--shadow-sm': '0 2px 8px rgba(0,0,0,0.2)',
    '--shadow-md': '0 8px 32px rgba(0,0,0,0.3)',
    '--shadow-lg': '0 16px 48px rgba(0,0,0,0.4)',
    '--hero-overlay': 'linear-gradient(180deg, rgba(8,8,13,0) 0%, rgba(8,8,13,0.15) 50%, rgba(8,8,13,0.92) 100%)',
    '--hero-overlay-top': 'linear-gradient(180deg, rgba(8,8,13,0.5) 0%, rgba(8,8,13,0) 30%)',
  },
};

const PROGRAM_STEPS = [
  { time: '17:00', title: 'Accueil des invités', desc: 'Réception et bienvenue', icon: Users },
  { time: '18:00', title: 'Cérémonie', desc: 'Cérémonie de mariage', icon: Heart },
  { time: '19:30', title: 'Cocktail', desc: 'Apéritifs et rafraîchissements', icon: Wine },
  { time: '21:00', title: 'Dîner', desc: 'Banquet de mariage', icon: UtensilsCrossed },
  { time: '23:00', title: 'Soirée', desc: 'Musique et célébrations', icon: Music },
];

const CountdownUnit = ({ value, label }) => {
  const prevValue = useRef(value);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (prevValue.current !== value) { setFlip(true); const t = setTimeout(() => setFlip(false), 500); prevValue.current = value; return () => clearTimeout(t); }
  }, [value]);
  return (
    <div className="cd-unit">
      <div className={`cd-value-wrap ${flip ? 'cd-flip' : ''}`}><span className="cd-value">{String(value).padStart(2, '0')}</span></div>
      <p className="cd-label">{label}</p>
    </div>
  );
};
const CountdownSeparator = () => (<div className="cd-sep"><div className="cd-sep-dot" /><div className="cd-sep-line" /></div>);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rsvpData, setRsvpData] = useState({ fullName: '', email: '', attending: '', message: '' });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const videoRef = useRef(null); const flashRef = useRef(null); const mainContentRef = useRef(null);
  const audioRef = useRef(null); const transitionVideoDarkRef = useRef(null); const transitionVideoLightRef = useRef(null);
  const heroRef = useRef(null); const heroContentRef = useRef(null);
  const invitationRef = useRef(null); const invitationOrnamentTopRef = useRef(null);
  const invitationTextRef = useRef(null); const invitationOrnamentBottomRef = useRef(null);
  const invitationSideLeftRef = useRef(null); const invitationSideRightRef = useRef(null);
  const lieuRef = useRef(null); const lieuHeaderRef = useRef(null); const lieuCardRef = useRef(null);
  const programRef = useRef(null); const programHeaderRef = useRef(null); const programTimelineRef = useRef(null);
  const eventRef = useRef(null); const eventHeaderRef = useRef(null); const eventCardRef = useRef(null);
  const rsvpRef = useRef(null); const rsvpHeaderRef = useRef(null); const rsvpCardRef = useRef(null);
  const countdownRef = useRef(null); const countdownTitleRef = useRef(null); const countdownCardRef = useRef(null);
  const footerRef = useRef(null);

  const targetDate = '2026-08-14';

  useEffect(() => { const vars = THEMES[theme]; const root = document.documentElement; Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v)); }, [theme]);

  useEffect(() => {
    const calculate = () => {
      const now = new Date(); const target = new Date(targetDate + 'T19:00:00'); const diff = target - now;
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    calculate(); const interval = setInterval(calculate, 1000); return () => clearInterval(interval);
  }, [targetDate]);

  const toggleTheme = useCallback(() => {
    if (isTransitioning) return;
    const next = theme === 'light' ? 'dark' : 'light';
    const vid = next === 'dark' ? transitionVideoDarkRef.current : transitionVideoLightRef.current;
    if (!vid) return;
    setIsTransitioning(true);
    transitionVideoDarkRef.current.style.display = 'none'; transitionVideoLightRef.current.style.display = 'none';
    vid.style.display = 'block'; vid.style.opacity = '0'; vid.currentTime = 0;
    const onReady = () => {
      vid.removeEventListener('playing', onReady); vid.style.opacity = '1';
      let themeSwitched = false;
      vid.ontimeupdate = () => {
  const switchPoint = vid.duration * 0.4;
  if (!themeSwitched && vid.currentTime >= switchPoint) {
    themeSwitched = true;

    const root = document.documentElement;
    const wrapper = document.querySelector('.app-wrapper');
    const heroLight = document.querySelector('.dn-hero-video--light');
    const heroDark = document.querySelector('.dn-hero-video--dark');
    const heroContent = document.querySelector('.dn-hero-content');

    // Couper toutes les transitions
    root.style.setProperty('transition', 'none');
    if (wrapper) wrapper.style.transition = 'none';
    if (heroLight) heroLight.style.transition = 'none';
    if (heroDark) heroDark.style.transition = 'none';
    if (heroContent) heroContent.style.transition = 'none';

    // Appliquer le thème
    const vars = THEMES[next];
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    if (wrapper) wrapper.setAttribute('data-theme', next);

    // Switcher les fonds hero immédiatement
    if (next === 'dark') {
      if (heroLight) heroLight.style.opacity = '0';
      if (heroDark) heroDark.style.opacity = '1';
    } else {
      if (heroLight) heroLight.style.opacity = '1';
      if (heroDark) heroDark.style.opacity = '0';
    }

    // Forcer le reflow
    void document.body.offsetHeight;

    // Restaurer les transitions
    requestAnimationFrame(() => {
      root.style.removeProperty('transition');
      if (wrapper) wrapper.style.transition = '';
      if (heroLight) heroLight.style.transition = '';
      if (heroDark) heroDark.style.transition = '';
      if (heroContent) heroContent.style.transition = '';
    });
  }
};
      vid.onended = () => { vid.ontimeupdate = null; vid.onended = null; vid.style.opacity = '0'; setTimeout(() => { vid.style.display = 'none'; setTheme(next); setIsTransitioning(false); }, 150); };
    };
    vid.addEventListener('playing', onReady); vid.play().catch(() => setIsTransitioning(false));
  }, [theme, isTransitioning]);

  const initScrollAnimations = useCallback(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (heroRef.current) gsap.to(heroContentRef.current, { y: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroRef.current, start: '50% top', end: 'bottom top', scrub: true } });
      [invitationSideLeftRef, invitationSideRightRef].forEach(ref => { if (ref.current) gsap.fromTo(ref.current, { height: 0, opacity: 0 }, { height: '10rem', opacity: 0.2, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: invitationRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }); });
      if (invitationOrnamentTopRef.current) gsap.fromTo(invitationOrnamentTopRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.4, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: invitationRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
      if (invitationTextRef.current) gsap.fromTo(invitationTextRef.current.querySelectorAll('.anim-line'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: invitationTextRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } });
      gsap.fromTo('.dn-quote-mark.open', { x: -30, opacity: 0 }, { x: 0, opacity: 0.2, duration: 0.8, ease: 'back.out(1.7)', scrollTrigger: { trigger: invitationRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
      gsap.fromTo('.dn-quote-mark.close', { x: 30, opacity: 0 }, { x: 0, opacity: 0.2, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)', scrollTrigger: { trigger: invitationRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
      if (invitationOrnamentBottomRef.current) gsap.fromTo(invitationOrnamentBottomRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 0.4, duration: 1, delay: 0.6, ease: 'power2.out', scrollTrigger: { trigger: invitationRef.current, start: 'top 60%', toggleActions: 'play none none reverse' } });
      gsap.to('.dn-invitation-bg-text', { y: -80, ease: 'none', scrollTrigger: { trigger: invitationRef.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      if (lieuHeaderRef.current) { gsap.fromTo(lieuHeaderRef.current.querySelector('.dn-lieu-title'), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: lieuRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } }); gsap.fromTo(lieuHeaderRef.current.querySelector('.dn-lieu-subtitle'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out', scrollTrigger: { trigger: lieuRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } }); }
      if (lieuCardRef.current) gsap.fromTo(lieuCardRef.current, { y: 80, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: lieuCardRef.current, start: 'top 85%', toggleActions: 'play none none reverse' } });
      if (programHeaderRef.current) gsap.fromTo(programHeaderRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: programRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
      if (programTimelineRef.current) { gsap.fromTo(programTimelineRef.current.querySelectorAll('.dn-tl-item'), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: programTimelineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }); const lf = programTimelineRef.current.querySelector('.dn-tl-line-fill'); if (lf) gsap.fromTo(lf, { scaleY: 0 }, { scaleY: 1, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: programTimelineRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }); }
      if (eventHeaderRef.current) gsap.fromTo(eventHeaderRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: eventRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
      if (eventCardRef.current) gsap.fromTo(eventCardRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: eventCardRef.current, start: 'top 85%', toggleActions: 'play none none reverse' } });
      if (rsvpHeaderRef.current) gsap.fromTo(rsvpHeaderRef.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: rsvpRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
      if (rsvpCardRef.current) gsap.fromTo(rsvpCardRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: rsvpCardRef.current, start: 'top 85%', toggleActions: 'play none none reverse' } });
      if (countdownTitleRef.current) gsap.fromTo(countdownTitleRef.current, { y: 40, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: countdownRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
      gsap.fromTo('.dn-cd-subtitle-row', { width: '0%', opacity: 0 }, { width: '100%', opacity: 1, duration: 1, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: countdownRef.current, start: 'top 75%', toggleActions: 'play none none reverse' } });
      if (countdownCardRef.current) gsap.fromTo(countdownCardRef.current, { y: 60, opacity: 0, rotateX: 10 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.2, delay: 0.4, ease: 'power3.out', scrollTrigger: { trigger: countdownRef.current, start: 'top 70%', toggleActions: 'play none none reverse' } });
      if (footerRef.current) gsap.fromTo(footerRef.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' } });
      document.querySelectorAll('.dn-section-border').forEach(b => gsap.fromTo(b, { width: '0%' }, { width: '60%', duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: b.parentElement, start: 'top 80%', toggleActions: 'play none none reverse' } }));
      document.querySelectorAll('.dn-gold-sep').forEach(s => gsap.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none reverse' } }));
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { if (isOpen) initScrollAnimations(); return () => { ScrollTrigger.getAll().forEach(t => t.kill()); }; }, [isOpen, initScrollAnimations]);

  const handleStartTransition = () => {
    if (hasStarted) return; setHasStarted(true);
    if (videoRef.current) videoRef.current.play();
    const tl = gsap.timeline();
    tl.to(flashRef.current, { opacity: 1, duration: 0.6, delay: 2, ease: "power2.in" })
      .call(() => { setIsOpen(true); window.scrollTo(0, 0); if (audioRef.current) { audioRef.current.volume = 0.4; audioRef.current.play().catch(() => {}); } }, null, "+=0.1")
      .fromTo(mainContentRef.current, { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power2.out" })
      .to(flashRef.current, { opacity: 0, duration: 1.5, ease: "power1.inOut" }, "-=1.5");
  };

  const toggleMute = () => { if (audioRef.current) { audioRef.current.muted = !audioRef.current.muted; setIsMuted(!isMuted); } };
  const handleRsvpSubmit = () => { if (!rsvpData.fullName || !rsvpData.attending) return; console.log('RSVP:', rsvpData); setRsvpSubmitted(true); };

  return (
    <div className="app-wrapper" data-theme={theme}>
      <div ref={flashRef} className="flash-overlay" />
      <audio ref={audioRef} loop preload="auto"><source src="/music.mp3" type="audio/mpeg" /></audio>
      <div className={`dn-transition-overlay ${isTransitioning ? 'active' : ''}`}>
        <video ref={transitionVideoDarkRef} playsInline muted preload="auto" src="/transition-to-dark.mp4" style={{ display: 'none' }} />
        <video ref={transitionVideoLightRef} playsInline muted preload="auto" src="/transition-to-light.mp4" style={{ display: 'none' }} />
      </div>

      {isOpen && (
        <div className="dn-fixed-controls">
          <button onClick={toggleMute} className="dn-control-btn" aria-label="Toggle musique">
            <div className="dn-control-icon">{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</div>
            {!isMuted && <div className="dn-music-bars"><span className="dn-bar dn-bar-1" /><span className="dn-bar dn-bar-2" /><span className="dn-bar dn-bar-3" /></div>}
          </button>
          <button onClick={toggleTheme} className="dn-control-btn dn-theme-btn" aria-label="Toggle thème">
            <div className={`dn-theme-icons ${theme === 'dark' ? 'is-dark' : ''}`}><Sun size={18} className="dn-sun-icon" /><Moon size={18} className="dn-moon-icon" /></div>
          </button>
        </div>
      )}

      {!isOpen && (
        <div className="ouverture-wrapper" onClick={handleStartTransition}>
          <div className={`ouverture-poster ${hasStarted ? 'hidden' : ''}`} style={{ backgroundImage: "url('/poster.jpg')" }} />
          <video ref={videoRef} className="ouverture-video" playsInline src="/ouverture.mp4" />
        </div>
      )}

      <main ref={mainContentRef} className={`main-content ${!isOpen ? 'hidden' : ''}`}>
        {/* HERO */}
        <header ref={heroRef} className="dn-hero">
          <div className="dn-hero-media">
            <video className="dn-hero-video dn-hero-video--light" autoPlay loop muted playsInline src="/lightbg.mp4" style={{ opacity: theme === 'light' ? 1 : 0 }} />
            <img className="dn-hero-video dn-hero-video--dark" src="/darkbg.jpg" alt="" style={{ opacity: theme === 'dark' ? 1 : 0 }} />
          </div>
          <div className="dn-hero-overlay-top" />
          <div ref={heroContentRef} className="dn-hero-content">
            <h1 className="dn-hero-title">Yacine &amp; Amel</h1>
            <div className="dn-hero-date-block"><p className="dn-hero-date">14 AOÛT 2026</p></div>
          </div>
          <div className="dn-scroll-indicator"><div className="dn-scroll-line" /></div>
        </header>

        {/* INVITATION */}
        <section ref={invitationRef} className="dn-invitation">
          <div className="dn-invitation-glow" />
          <div ref={invitationSideLeftRef} className="dn-invitation-side-line left" />
          <div ref={invitationSideRightRef} className="dn-invitation-side-line right" />
          <div className="dn-invitation-bg-text">Mariage</div>
          <div className="dn-invitation-content">
            <div ref={invitationOrnamentTopRef} className="dn-ornament">
              <div className="dn-gold-line-r" />
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1 L10.2 6.8 L16 9 L10.2 11.2 L9 17 L7.8 11.2 L2 9 L7.8 6.8 Z" fill="var(--gold)" opacity="0.8" /></svg>
              <div className="dn-gold-line-l" />
            </div>
            <div ref={invitationTextRef} className="dn-quote-wrapper">
              <span className="dn-quote-mark open">&ldquo;</span>
              <p className="dn-invitation-text">
                <span className="anim-line">Dans la joie et la gratitude envers Allah,</span><br />
                <span className="anim-line">nous avons l'honneur de vous convier</span><br />
                <span className="anim-line">à la célébration de notre mariage.</span>
              </p>
              <span className="dn-quote-mark close">&rdquo;</span>
            </div>
            <div ref={invitationOrnamentBottomRef} className="dn-ornament">
              <div className="dn-gold-line-r" /><span className="dn-gold-flower">✿</span><div className="dn-gold-line-l" />
            </div>
          </div>
        </section>

        {/* EVENT DETAILS — cream/beige style like inspiration */}
        <section ref={eventRef} className="dn-event">
          <div ref={eventHeaderRef} className="dn-event-header">
            <p className="dn-event-surtitle">REJOIGNEZ-NOUS</p>
            <h2 className="dn-event-title">La Cérémonie</h2>
            <p className="dn-event-desc">Nous avons hâte de célébrer ce jour spécial avec vous. Voici tout ce que vous devez savoir.</p>
          </div>
          <div ref={eventCardRef} className="dn-event-card">
            <div className="dn-event-sparkle">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 2L23 16L36 20L23 24L20 38L17 24L4 20L17 16Z" stroke="#C4A265" strokeWidth="1.2" fill="none" />
                <path d="M20 10L21 16L26 20L21 24L20 30L19 24L14 20L19 16Z" fill="#C4A265" opacity="0.25" />
              </svg>
            </div>
            <h3 className="dn-event-name">Cérémonie de Mariage</h3>
            <div className="dn-event-sep" />
            <div className="dn-event-info"><Clock size={16} strokeWidth={1.5} /><span>19:00</span></div>
            <div className="dn-event-info"><MapPin size={16} strokeWidth={1.5} /><span>Salle Les Roses d'Or</span></div>
            <p className="dn-event-addr">Sidi Abdellah</p>
            <p className="dn-event-addr sub">Alger, Algérie</p>
            <div className="dn-event-map">
              <iframe title="Ceremony location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz" width="100%" height="100%" allowFullScreen loading="lazy" />
            </div>
          </div>
        </section>

        {/* DAY PROGRAM — olive green like inspiration */}
        <section ref={programRef} className="dn-program">
          <div ref={programHeaderRef} className="dn-program-header">
            <h2 className="dn-program-title">Programme</h2>
            <p className="dn-program-subtitle">Ce que nous avons préparé pour vous</p>
          </div>
          <div ref={programTimelineRef} className="dn-tl">
            <div className="dn-tl-line"><div className="dn-tl-line-fill" /></div>
            {PROGRAM_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div className="dn-tl-item" key={i}>
                  <div className="dn-tl-dot"><Icon size={18} strokeWidth={1.5} /></div>
                  <div className="dn-tl-body">
                    <span className="dn-tl-time">{step.time}</span>
                    <span className="dn-tl-name">{step.title}</span>
                    <span className="dn-tl-desc">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LE LIEU */}
     {/*    <section ref={lieuRef} className="dn-lieu">
          <div className="dn-section-border top" /><div className="dn-section-border bottom" />
          <div ref={lieuHeaderRef} className="dn-lieu-header">
            <p className="dn-lieu-title">Le Lieu</p><p className="dn-lieu-subtitle">Où nous célébrons</p>
          </div>
          <div ref={lieuCardRef} className="dn-lieu-card">
            <div className="dn-lieu-image-wrapper"><img src={fleur} alt="Salle Les Roses d'Or" className="dn-lieu-image" /></div>
            <div className="dn-lieu-card-body">
              <div className="dn-lieu-name"><p className="dn-lieu-name-text">Salle Les Roses d'Or</p></div>
              <div className="dn-gold-sep" />
              <div className="dn-lieu-datetime"><p className="dn-lieu-datetime-text">14 Août 2026<span className="dn-lieu-dot">·</span><span>19:00</span></p></div>
              <div className="dn-gold-sep thin" />
              <div className="dn-lieu-address"><p className="dn-lieu-city">Sidi Abdellah</p><p className="dn-lieu-country">Alger, Algérie</p></div>
              <div className="dn-lieu-map-wrapper">
                <iframe title="Location map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz" width="100%" height="100%" className="dn-lieu-map" allowFullScreen loading="lazy" />
              </div>
              <div className="dn-lieu-btn-wrapper"><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="dn-lieu-btn"><Navigation size={14} />Ouvrir l'itinéraire</a></div>
            </div>
          </div>
        </section> */}

        {/* RSVP — cream bg, olive button like inspiration */}
        <section ref={rsvpRef} className="dn-rsvp">
          <div ref={rsvpHeaderRef} className="dn-rsvp-header">
            <p className="dn-rsvp-surtitle">SOYEZ NOTRE INVITÉ</p>
            <h2 className="dn-rsvp-title">RSVP</h2>
            <div className="dn-rsvp-ornament">
              <div className="dn-rsvp-orn-line" /><Heart size={18} strokeWidth={1.5} className="dn-rsvp-heart" /><div className="dn-rsvp-orn-line" />
            </div>
            <p className="dn-rsvp-desc">Merci de confirmer votre présence avant le 1er Août 2026</p>
          </div>
          <div ref={rsvpCardRef} className="dn-rsvp-card">
            {!rsvpSubmitted ? (
              <>
                <div className="dn-rsvp-field">
                  <label className="dn-rsvp-label">Nom complet *</label>
                  <input type="text" className="dn-rsvp-input" placeholder="Votre nom complet" value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} />
                </div>
                <div className="dn-rsvp-field">
                  <label className="dn-rsvp-label">Adresse email</label>
                  <input type="email" className="dn-rsvp-input" placeholder="votre@email.com" value={rsvpData.email} onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })} />
                </div>
                <div className="dn-rsvp-field">
                  <label className="dn-rsvp-label">Serez-vous présent(e) ? *</label>
                  <div className="dn-rsvp-radios">
                    <label className={`dn-rsvp-radio ${rsvpData.attending === 'yes' ? 'active' : ''}`}>
                      <input type="radio" name="attending" value="yes" checked={rsvpData.attending === 'yes'} onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })} />
                      <span className="dn-rsvp-circle" />Avec joie, oui
                    </label>
                    <label className={`dn-rsvp-radio ${rsvpData.attending === 'no' ? 'active' : ''}`}>
                      <input type="radio" name="attending" value="no" checked={rsvpData.attending === 'no'} onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value })} />
                      <span className="dn-rsvp-circle" />Malheureusement, non
                    </label>
                  </div>
                </div>
                <div className="dn-rsvp-field">
                  <label className="dn-rsvp-label">Message pour les mariés</label>
                  <textarea className="dn-rsvp-textarea" placeholder="Partagez vos vœux..." rows={4} value={rsvpData.message} onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })} />
                </div>
                <button className="dn-rsvp-btn" onClick={handleRsvpSubmit}><Send size={16} />Envoyer le RSVP</button>
              </>
            ) : (
              <div className="dn-rsvp-ok">
                <Heart size={32} className="dn-rsvp-ok-icon" />
                <p className="dn-rsvp-ok-title">Merci !</p>
                <p className="dn-rsvp-ok-text">Votre réponse a bien été enregistrée.<br />Nous avons hâte de vous retrouver.</p>
              </div>
            )}
          </div>
        </section>

        {/* COUNTDOWN */}
        <section ref={countdownRef} className="dn-countdown">
          <div className="dn-section-border top" /><div className="dn-section-border bottom" />
          <div className="dn-countdown-inner">
            <h2 ref={countdownTitleRef} className="dn-cd-title">Compte à rebours</h2>
            <div className="dn-cd-subtitle-row"><div className="dn-cd-sub-line" /><p className="dn-cd-subtitle">Jusqu'au jour J</p><div className="dn-cd-sub-line right" /></div>
            <div ref={countdownCardRef} className="dn-cd-card">
              <div className="dn-cd-numbers">
                <CountdownUnit value={timeLeft.days} label="Jours" /><CountdownSeparator />
                <CountdownUnit value={timeLeft.hours} label="Heures" /><CountdownSeparator />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" /><CountdownSeparator />
                <CountdownUnit value={timeLeft.seconds} label="Secondes" />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dn-footer">
          <div ref={footerRef} className="dn-footer-inner">
            <p className="dn-footer-families">Familles Belkacem &amp; Mansouri</p>
            <div className="dn-footer-divider" />
            <span className="dn-footer-credit">Made with love by </span>
            <a href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3" target="_blank" rel="noopener noreferrer" className="dn-footer-link"><span className="dn-footer-credit">Digital Invitation</span></a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;