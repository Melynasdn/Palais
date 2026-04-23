import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, Sun, Moon, Heart, Wine, UtensilsCrossed, Music, Send, Origami,Star } from 'lucide-react';
import CoupleFrame from './assets/CoupleFrame.png';
import CoupleFrameDark from './assets/CoupleFrameDark.png';
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
      if (footerRef.current) gsap.fromTo(
  footerRef.current.children,
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: footerRef.current,
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  }
);
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


  /* ===============RSVP =================== */
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState('');

const SHEETDB_URL = 'https://sheetdb.io/api/v1/4ftqiihm01qka'; 

const handleRsvpSubmit = async () => {
  if (!rsvpData.fullName || !rsvpData.attending) {
    setSubmitError('Veuillez remplir les champs obligatoires.');
    return;
  }

  setIsSubmitting(true);
  setSubmitError('');

  try {
    const response = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          timestamp: new Date().toLocaleString('fr-FR'),
          fullName: rsvpData.fullName,
          email: rsvpData.email || '—',
          attending: rsvpData.attending === 'yes' ? '✅ Présent' : '❌ Absent',
          message: rsvpData.message || '—',
        }
      }),
    });

    if (!response.ok) throw new Error('Erreur réseau');

    setRsvpSubmitted(true);
  } catch (err) {
    setSubmitError('Une erreur est survenue. Veuillez réessayer.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="app-wrapper" data-theme={theme}>
      <div ref={flashRef} className="flash-overlay" />
      <audio ref={audioRef} loop preload="auto"><source src="/music.mp3" type="audio/mpeg" /></audio>


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

       {/* ════════════ HERO ════════════ */}
   
<header ref={heroRef} className="dn-hero">
  <div className="dn-hero-media">
    <video
      className="dn-hero-video dn-hero-video--light"
      autoPlay loop muted playsInline
      src="/lightbg.mp4"
      style={{ opacity: theme === 'light' ? 1 : 0 }}
    />
    <img
      className="dn-hero-video dn-hero-video--dark"
      src="/darkbg.jpg"
      alt=""
      style={{ opacity: theme === 'dark' ? 1 : 0 }}
    />
  </div>

  {/* Transition overlay DANS le hero */}
  <div className={`dn-transition-overlay ${isTransitioning ? 'active' : ''}`}>
    <video ref={transitionVideoDarkRef} playsInline muted preload="auto" src="/transition-to-dark.mp4" style={{ display: 'none' }} />
    <video ref={transitionVideoLightRef} playsInline muted preload="auto" src="/transition-to-light.mp4" style={{ display: 'none' }} />
  </div>

  <div className="dn-hero-overlay-top" />

  <div
    ref={heroContentRef}
    className="dn-hero-content"
    style={{
      marginTop: '-18vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <p style={{
      fontFamily: '"Playfair Display", serif',
      fontSize: 'clamp(0.60rem, 1.8vw, 0.78rem)',
      letterSpacing: '0.5em',
      textTransform: 'uppercase',
      fontWeight: 800,
      color: theme === 'dark' ? '#c8bda4' : '#4a5a3f',
      marginBottom: '1rem',
      marginTop: 0,
      transition: 'color 0.5s ease',
      opacity: 0.85,
    }}>
      We are getting married
    </p>

    <h1 style={{
      fontFamily: '"Great Vibes", cursive',
      fontSize: 'clamp(3.2rem, 13vw, 6rem)',
      fontWeight: 400,
      color: theme === 'dark' ? '#f0e6cc' : '#3d4e35',
      lineHeight: 1.05,
      margin: '0 0 0.6rem 0',
      textShadow: theme === 'dark'
        ? '0 2px 40px rgba(0,0,0,0.35)'
        : '0 2px 24px rgba(255,255,255,0.5)',
      transition: 'color 0.5s ease, text-shadow 0.5s ease',
      letterSpacing: '0.02em',
    }}>
      Amine &amp; Ilona
    </h1>

    <div style={{
      width: '40px',
      height: '1px',
      background: theme === 'dark' ? 'rgba(200,189,164,0.4)' : 'rgba(74,90,63,0.35)',
      margin: '0.1rem 0 0.75rem',
      transition: 'background 0.5s ease',
    }} />

    <p style={{
      fontFamily: '"Playfair Display", serif',
      fontSize: 'clamp(0.65rem, 2vw, 0.82rem)',
      letterSpacing: '0.38em',
      textTransform: 'uppercase',
      fontWeight: 800,
      fontStyle: 'italic',
      color: theme === 'dark' ? 'rgba(200,189,164,0.7)' : 'rgba(74,90,63,0.75)',
      margin: 0,
      transition: 'color 0.5s ease',
    }}>
      14 Août 2026
    </p>
  </div>

  <div className="dn-scroll-indicator">
    <div className="dn-scroll-line" />
  </div>
</header>


{/* ════════════ WELCOME / INVITATION ════════════ */}
<section className="dn-welcome">

  <h2 className="dn-welcome-title">
    Bienvenue !
  </h2>

  <p className="dn-welcome-text">
    C’est avec beaucoup d’amour que nous vous convions à célébrer notre mariage à Chantilly, et à vivre à nos côtés un instant précieux et inoubliable.
  </p>

<div className="dn-welcome-ribbon">
  <div className="dn-ribbon-track">
    {['/photo1.jpg','/photo2.jpg','/photo3.jpg','/photo4.jpg',
      '/photo1.jpg','/photo2.jpg','/photo3.jpg','/photo4.jpg',
    ].map((src, i) => (
      <div key={i} className="dn-ribbon-item" style={{ backgroundImage: `url('${src}')` }} />
    ))}
  </div>
</div>
</section>



       {/* ════════════ PROGRAMME DU JOUR ════════════ */}
<section className="dn-day-program-v2">

  <div className="dn-dp-header">
    <h2 className="dn-dp-title">Programme du Jour</h2>
    <p className="dn-dp-subtitle">Ce que nous avons préparé pour vous</p>
  </div>

  <div className="dn-dp-timeline-v2">
    <div className="dn-dp-line-track-v2"></div>

    {[
      { time: '16h30', name: 'Arrivée des Invités', desc: 'Accueil et réception', icon: 'guests' },
      { time: '17h00', name: 'Cérémonie', desc: 'Mariage civil', icon: 'heart' },
      { time: '18h00', name: 'Cocktail', desc: 'Apéritifs et boissons', icon: 'glass' },
      { time: '20h00', name: 'Dîner', desc: 'Banquet de mariage', icon: 'fork' },
      { time: '22h00', name: 'Fête', desc: 'Musique et célébration', icon: 'party' },
      { time: '04h00', name: 'Fin de la Soirée', desc: 'Au revoir et bonne nuit', icon: 'end' },
    ].map(({ time, name, desc, icon }, index) => (
      <div className={`dn-dp-item-v2 ${index % 2 === 0 ? 'dn-dp-item-left' : 'dn-dp-item-right'}`} key={time}>

        <div className="dn-dp-marker">
          <div className="dn-dp-icon-wrap-v2">
            {icon === 'guests' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            )}
            {icon === 'heart' && <Heart />}
            {icon === 'glass' && <Wine />}
            {icon === 'fork' && <UtensilsCrossed />}
            {icon === 'party' && <Music />}
            {icon === 'end' && <Origami />}
          </div>
          <span className="dn-dp-badge-v2">{time}</span>
        </div>

        <div className="dn-dp-info-card">
          <h3 className="dn-dp-event-name-v2">{name}</h3>
          <p className="dn-dp-desc-v2">{desc}</p>
        </div>

      </div>
    ))}
  </div>
</section>
 




{/* ════════════ DÉTAILS DE L'ÉVÉNEMENT ════════════ */}
<section className="dn-event-details">

  <div className="dn-ed-header">
    <p className="dn-ed-join">REJOIGNEZ-NOUS</p>
    <h2 className="dn-ed-title">Détails de l'Événement</h2>
    <p className="dn-ed-intro">
      Nous avons hâte de célébrer ce jour spécial avec vous.
      <br />
      Voici tout ce que vous devez savoir.
    </p>
  </div>

  <div className="dn-ed-card">
    <div className="dn-ed-icon-wrap">
      <Star size={24} strokeWidth={1.5} className="dn-ed-icon" />
    </div>

    <p className="dn-ed-event-title">Cérémonie de Mariage</p>

    <div className="dn-ed-meta">
      <div className="dn-ed-meta-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        <span>19h00</span>
      </div>

      <div className="dn-ed-meta-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>Château de Chantilly</span>
      </div>
    </div>

    <p className="dn-ed-address">
      60500 Chantilly<br />
      France
    </p>

    <div className="dn-ed-map-wrap">
      <iframe
        title="Carte du lieu"
        src="https://maps.google.com/maps?q=Chateau+de+Chantilly,+France&output=embed"
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        className="dn-ed-map"
      />
    </div>

    <p className="dn-ed-caption">
      Rejoignez-nous dans un cadre royal et élégant pour célébrer ce moment inoubliable.
    </p>

    <a
      href="https://maps.google.com/?q=Chateau+de+Chantilly,+France"
      target="_blank"
      rel="noopener noreferrer"
      className="dn-ed-btn"
    >
      Ouvrir dans Maps
    </a>

    <button
      className="dn-ed-btn"
      onClick={() => {
        const ics = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'DTSTART:20260814T190000',
          'DTEND:20260815T030000',
          'SUMMARY:Mariage',
          'LOCATION:Château de Chantilly, France',
          'DESCRIPTION:Cérémonie de mariage',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([ics], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'event.ics';
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      Ajouter au Calendrier
    </button>

  </div>

</section>

{/* ════════════ NO KIDS ════════════ */}
{/* <section className="dn-nokids">
  <div className="dn-nokids-inner">
     <div className="dn-nokids-icon">
      🚫👶
    </div> 
    <h2 className="dn-nokids-title">Cérémonie Adultes Uniquement</h2>
    <div className="dn-nokids-sep" />
    <p className="dn-nokids-text">
      Afin que chacun puisse profiter pleinement de cette journée,<br />
      nous vous informons que les enfants ne seront<br />
      <strong>pas admis</strong> lors de notre célébration.
    </p>
    <p className="dn-nokids-sub">
      Nous vous remercions de votre compréhension.
    </p>
  </div>
</section> */}


<div className="dn-img-divider">
  <img 
    src={theme === 'dark' ? CoupleFrameDark : CoupleFrame}
    alt="Couple Illustration" 
    className="couple-illustration" 
  />
</div>





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

                {submitError && (
  <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>
    {submitError}
  </p>
)}

<button
  className="dn-rsvp-btn"
  onClick={handleRsvpSubmit}
  disabled={isSubmitting}
  style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
>
  <Send size={16} />
  {isSubmitting ? 'Envoi en cours…' : 'Envoyer le RSVP'}
</button>

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
  <div className="dn-countdown-inner">

    <div ref={countdownTitleRef} className="dn-cd-header">
      <p className="dn-cd-surtitle">David & Ilona</p>
      <h2 className="dn-cd-title-new">Compte à Rebours</h2>
      <div className="dn-cd-sep-line" />
    </div>

    <div ref={countdownCardRef} className="dn-cd-rings-wrap">
      {[
        { value: timeLeft.days,    label: 'JOURS',    max: 365, id: 'rg1' },
        { value: timeLeft.hours,   label: 'HEURES',   max: 24,  id: 'rg2' },
        { value: timeLeft.minutes, label: 'MINUTES',  max: 60,  id: 'rg3' },
        { value: timeLeft.seconds, label: 'SECONDES', max: 60,  id: 'rg4' },
      ].map(({ value, label, max, id }) => {
        const r = 36;
        const circ = 2 * Math.PI * r;
        const dash = circ * Math.min(value / max, 1);
        return (
          <div key={id} className="dn-cd-ring-item">
            <svg width="92" height="92" viewBox="0 0 92 92">
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={theme === 'dark' ? '#FAF7F2' : '#c8bda4'}/>
      <stop offset="100%" stopColor={theme === 'dark' ? '#FAF7F2' : '#a89880'} stopOpacity="0.8"/>
    </linearGradient>
  </defs>

  {/* Track */}
  <circle cx="46" cy="46" r={r}
    fill="none"
    stroke={theme === 'dark' ? 'rgba(250,247,242,0.1)' : 'rgba(200,189,164,0.1)'}
    strokeWidth="2.5"
  />

  {/* Progress */}
  <circle cx="46" cy="46" r={r}
    fill="none"
    stroke={`url(#${id})`}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeDasharray={`${dash} ${circ}`}
    transform="rotate(-90 46 46)"
    style={{ transition: 'stroke-dasharray 1s ease' }}
  />

  {/* Valeur */}
  <text x="46" y="42" textAnchor="middle"
    fontFamily="Cormorant Garamond, Georgia, serif"
    fontSize="22" fontWeight="300"
    fill={theme === 'dark' ? '#FAF7F2' : '#f0e6cc'}>
    {String(value).padStart(2, '0')}
  </text>

  {/* Label */}
  <text x="46" y="56" textAnchor="middle"
    fontFamily="Josefin Sans, sans-serif"
    fontSize="6" fontWeight="300"
    fill={theme === 'dark' ? 'rgba(250,247,242,0.55)' : 'rgba(200,189,164,0.55)'}
    letterSpacing="2">
    {label}
  </text>
</svg>
          </div>
        );
      })}
    </div>

    <div className="dn-cd-date-row">
      <div className="dn-cd-date-line" />
      <span className="dn-cd-date-txt">14 Août 2026</span>
      <div className="dn-cd-date-line" />
    </div>

  </div>
</section>


    <footer className="dn-footer">
  <div ref={footerRef} className="dn-footer-inner">
    <p className="dn-footer-credit">
      Made with love by{" "}
      <a
        className="dn-footer-link"
        href="https://www.instagram.com/rfinvites"
        target="_blank"
        rel="noopener noreferrer"
      >
        RF-Invites
      </a>
    </p>
  </div>
</footer>

      </main>
    </div>
  );
};
export default App;