import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2, VolumeX, Sun, Moon, Heart, Send, Star } from 'lucide-react';
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
  const [pendingDarkSwitch, setPendingDarkSwitch] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [rsvpData, setRsvpData] = useState({ fullName: '', email: '', attending: '', message: '' });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const [showChromePrompt, setShowChromePrompt] = useState(false);

  useEffect(() => {
    const isSamsungBrowser = /SamsungBrowser/i.test(navigator.userAgent);
    if (isSamsungBrowser) {
      setShowChromePrompt(true);
    }
  }, []);

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
  const targetDate = '2026-06-20';


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
      let textSwitched = false;
      vid.ontimeupdate = () => {
        const switchPoint = vid.duration * 0.4;
        const textSwitchPoint = vid.duration * 0.15;

        if (!textSwitched && vid.currentTime >= textSwitchPoint) {
          textSwitched = true;
          const heroContent = document.querySelector('.dn-hero-content');
          if (heroContent) {
            heroContent.querySelectorAll('p, h1, div').forEach(el => {
              el.style.transition = 'color 2s ease, background 2s ease, text-shadow 2s ease';
            });
          }
          setTheme(prev => prev);
          const isDark = next === 'dark';
          heroContent?.querySelectorAll('p').forEach((p, i) => {
            if (i === 0) p.style.color = isDark ? '#c8bda4' : '#4a5a3f';
            if (i === 1) p.style.color = isDark ? 'rgba(200,189,164,0.7)' : 'rgba(74,90,63,0.75)';
          });
          const h1 = heroContent?.querySelector('h1');
          if (h1) {
            h1.style.color = isDark ? '#f0e6cc' : '#3d4e35';
            h1.style.textShadow = isDark
              ? '0 2px 40px rgba(0,0,0,0.35)'
              : '0 2px 24px rgba(255,255,255,0.5)';
          }
          const line = heroContent?.querySelector('div');
          if (line) line.style.background = isDark ? 'rgba(200,189,164,0.4)' : 'rgba(74,90,63,0.35)';
        }

        if (!themeSwitched && vid.currentTime >= switchPoint) {
          themeSwitched = true;

          const root = document.documentElement;
          const wrapper = document.querySelector('.app-wrapper');
          const heroLight = document.querySelector('.dn-hero-video--light');
          const heroDark = document.querySelector('.dn-hero-video--dark');

          root.style.setProperty('transition', 'none');
          if (wrapper) wrapper.style.transition = 'none';
          if (heroLight) heroLight.style.transition = 'none';
          if (heroDark) heroDark.style.transition = 'none';

          const vars = THEMES[next];
          Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
          if (wrapper) wrapper.setAttribute('data-theme', next);

          if (next === 'dark') {
            if (heroLight) heroLight.style.opacity = '0';
            if (heroDark) heroDark.style.opacity = '1';
          } else {
            if (heroLight) heroLight.style.opacity = '1';
            if (heroDark) heroDark.style.opacity = '0';
          }

          void document.body.offsetHeight;

          requestAnimationFrame(() => {
            root.style.removeProperty('transition');
            if (wrapper) wrapper.style.transition = '';
            if (heroLight) heroLight.style.transition = '';
            if (heroDark) heroDark.style.transition = '';
          });
        }
      };
      vid.onended = () => { vid.ontimeupdate = null; vid.onended = null; vid.style.opacity = '0'; setTimeout(() => { vid.style.display = 'none'; setTheme(next); setIsTransitioning(false); }, 150); };
    };
    vid.addEventListener('playing', onReady); vid.play().catch(() => setIsTransitioning(false));
  }, [theme, isTransitioning]);


  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (isIOS) return;

    const isChrome = /Chrome\/\d+/.test(navigator.userAgent) && !/SamsungBrowser/i.test(navigator.userAgent);
    if (isChrome) return;

    const isSamsungBrowser = /SamsungBrowser/i.test(navigator.userAgent);
    if (isSamsungBrowser) return;

    let prefersDark = false;
    try {
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {}

    if (!prefersDark) {
      try {
        const testDiv = document.createElement('div');
        testDiv.style.cssText = 'background:Canvas;position:absolute;visibility:hidden;width:1px;height:1px;';
        document.body.appendChild(testDiv);
        const bg = getComputedStyle(testDiv).backgroundColor;
        document.body.removeChild(testDiv);
        const match = bg.match(/\d+/g);
        if (match && parseInt(match[0]) < 128 && parseInt(match[1]) < 128 && parseInt(match[2]) < 128) {
          prefersDark = true;
        }
      } catch (e) {}
    }

    if (prefersDark) {
      setPendingDarkSwitch(true);
    }
  }, []);


  useEffect(() => {
    if (isOpen && pendingDarkSwitch && theme === 'light' && !isTransitioning) {
      const timer = setTimeout(() => {
        toggleTheme();
        setPendingDarkSwitch(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pendingDarkSwitch, theme, isTransitioning, toggleTheme]);


  useEffect(() => { const vars = THEMES[theme]; const root = document.documentElement; Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v)); }, [theme]);

  useEffect(() => {
    const calculate = () => {
      const now = new Date(); const target = new Date(targetDate + 'T16:00:00'); const diff = target - now;
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    calculate(); const interval = setInterval(calculate, 1000); return () => clearInterval(interval);
  }, [targetDate]);


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


  /* =============== RSVP =================== */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const SHEETDB_URL = 'https://sheetdb.io/api/v1/gbbytqb7a495n';

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

  // Pause musique quand l'utilisateur quitte l'onglet/app
  useEffect(() => {
    const handleVisibility = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else if (isOpen && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isOpen, isMuted]);


  return (
    <div className="app-wrapper" data-theme={theme}>
      <div ref={flashRef} className="flash-overlay" />
      <audio ref={audioRef} loop preload="auto"><source src="/music.mp3" type="audio/mpeg" /></audio>

      {/* Prompt Samsung → Chrome */}
      {showChromePrompt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '20px',
            padding: '40px 28px',
            maxWidth: '340px',
            textAlign: 'center',
            border: '1px solid rgba(196,162,101,0.2)',
          }}>
            <p style={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: '1.8rem',
              color: '#C4A265',
              marginBottom: '20px',
            }}>
              Meilleure expérience
            </p>
            <p style={{
              fontFamily: '"Josefin Sans", sans-serif',
              fontSize: '0.82rem',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}>
              Pour profiter pleinement de votre invitation, veuillez ouvrir ce lien dans Chrome.
            </p>

            <button
              onClick={() => {
                window.location.href = 'intent://alexandre-et-camille.vercel.app/#Intent;scheme=https;package=com.android.chrome;end';
              }}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: '#C4A265',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '12px',
                fontFamily: '"Josefin Sans", sans-serif',
                fontSize: '0.82rem',
                fontWeight: 400,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Ouvrir dans Chrome
            </button>

            <button
              onClick={() => {
                setShowChromePrompt(false);
                setPendingDarkSwitch(true);
              }}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontFamily: '"Josefin Sans", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 300,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              Continuer ici
            </button>
          </div>
        </div>
      )}


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
              Alexandre &amp; Camille
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
              20 Juin 2026
            </p>
          </div>

          <div className="dn-scroll-indicator">
            <div className="dn-scroll-line" />
          </div>
        </header>


        {/* ════════════ WELCOME / INVITATION ════════════ */}
        <section className="dn-welcome">

          <h2 className="dn-welcome-title">
            À l'occasion de cette union,
          </h2>

          <p className="dn-welcome-text">
            Nous avons l'honneur de vous convier à partager avec nous ce mariage<br />
            entourés de nos familles et de nos proches, dans une ambiance de joie, d'élégance et de partage.
            <br />
            Votre présence à nos côtés sera pour nous un immense bonheur et contribuera à rendre cette soirée inoubliable.
          </p>

          <div className="dn-welcome-ribbon">
            <div className="dn-ribbon-track">
              {['/photo1.jpg','/photo2.jpg','/photo3.jpg','/photo4.jpg','/photo5.jpg','/photo6.jpg',
                '/photo1.jpg','/photo2.jpg','/photo3.jpg','/photo4.jpg','/photo5.jpg','/photo6.jpg',
              ].map((src, i) => (
                <div key={i} className="dn-ribbon-item" style={{ backgroundImage: `url('${src}')` }} />
              ))}
            </div>
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
                <span>À partir de 16h00</span>
              </div>

              <div className="dn-ed-meta-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Orangerie — Château de Vaux-le-Vicomte</span>
              </div>
            </div>

            <p className="dn-ed-address">
              Château de Vaux-le-Vicomte<br />
              77950 Maincy, Île-de-France<br />
              France
            </p>

            <div className="dn-ed-map-wrap">
              <iframe
                title="Carte du lieu"
                src="https://maps.google.com/maps?q=Chateau+de+Vaux+le+Vicomte+Maincy&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                className="dn-ed-map"
              />
            </div>

            <p className="dn-ed-caption">
              Rejoignez-nous dans un cadre historique et enchanteur pour célébrer ce moment inoubliable.
            </p>

            <a
              href="https://maps.google.com/?q=Chateau+de+Vaux+le+Vicomte+Maincy"
              target="_blank"
              rel="noopener noreferrer"
              className="dn-ed-btn"
            >
              Ouvrir dans Maps
            </a>

          </div>

        </section>

        {/* ════════════ NO KIDS ════════════ */}
        <section className="dn-nokids">
          <div className="dn-nokids-inner">
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
        </section>


        <div className="dn-img-divider">
          <img
            src={theme === 'dark' ? CoupleFrameDark : CoupleFrame}
            alt="Couple Illustration"
            className="couple-illustration"
          />
        </div>


        {/* RSVP */}
        <section ref={rsvpRef} className="dn-rsvp">
          <div ref={rsvpHeaderRef} className="dn-rsvp-header">
            <p className="dn-rsvp-surtitle">SOYEZ NOTRE INVITÉ</p>
            <h2 className="dn-rsvp-title">RSVP</h2>
            <div className="dn-rsvp-ornament">
              <div className="dn-rsvp-orn-line" /><Heart size={18} strokeWidth={1.5} className="dn-rsvp-heart" /><div className="dn-rsvp-orn-line" />
            </div>
            <p className="dn-rsvp-desc">Merci de confirmer votre présence avant le 1er Juin 2026</p>
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
              <p className="dn-cd-surtitle">Alexandre & Camille</p>
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
                    <svg viewBox="0 0 92 92">
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
              <span className="dn-cd-date-txt">20 Juin 2026</span>
              <div className="dn-cd-date-line" />
            </div>

          </div>
        </section>


        <footer className="dn-footer">
          <div className="dn-footer-inner">
            <p className="dn-footer-credit">Made with love by Digital.invites.dz</p>

            <div className="dn-footer-socials">
              <a href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3&utm_source=qr" target="_blank" rel="noopener noreferrer" className="dn-footer-social" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@digitalinvitations.dz?_r=1&_t=ZS-95n59pHQKs3" target="_blank" rel="noopener noreferrer" className="dn-footer-social" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};
export default App;