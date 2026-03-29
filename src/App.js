import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

import fleur from './assets/fleur.jpg';
import './App.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════════
   THEME CONFIGURATION
   ═══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════
   COUNTDOWN UNIT
   ═══════════════════════════════════════════════ */
const CountdownUnit = ({ value, label }) => {
  const prevValue = useRef(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlip(true);
      const t = setTimeout(() => setFlip(false), 500);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  const display = String(value).padStart(2, '0');

  return (
    <div className="cd-unit">
      <div className={`cd-value-wrap ${flip ? 'cd-flip' : ''}`}>
        <span className="cd-value">{display}</span>
      </div>
      <p className="cd-label">{label}</p>
    </div>
  );
};

const CountdownSeparator = () => (
  <div className="cd-sep">
    <div className="cd-sep-dot" />
    <div className="cd-sep-line" />
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════ */
const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);
  const audioRef = useRef(null);
  const transitionVideoDarkRef = useRef(null);
  const transitionVideoLightRef = useRef(null);
  const overlayRef = useRef(null);

  // Store first-frame posters to avoid black flash
  const postersRef = useRef({ dark: null, light: null });

  // Refs for scroll animations
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const invitationRef = useRef(null);
  const invitationOrnamentTopRef = useRef(null);
  const invitationTextRef = useRef(null);
  const invitationOrnamentBottomRef = useRef(null);
  const invitationSideLeftRef = useRef(null);
  const invitationSideRightRef = useRef(null);
  const lieuRef = useRef(null);
  const lieuHeaderRef = useRef(null);
  const lieuCardRef = useRef(null);
  const countdownRef = useRef(null);
  const countdownTitleRef = useRef(null);
  const countdownCardRef = useRef(null);
  const footerRef = useRef(null);

  const targetDate = '2026-08-14';

  /* ── Capture first frame of each transition video as poster ── */
  useEffect(() => {
    const captureFrame = (vid, key) => {
      const handler = () => {
        vid.removeEventListener('loadeddata', handler);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = vid.videoWidth;
          canvas.height = vid.videoHeight;
          canvas.getContext('2d').drawImage(vid, 0, 0);
          postersRef.current[key] = canvas.toDataURL('image/jpeg', 0.8);
        } catch (e) { /* cross-origin: ignore */ }
      };
      vid.addEventListener('loadeddata', handler);
    };
    if (transitionVideoDarkRef.current) captureFrame(transitionVideoDarkRef.current, 'dark');
    if (transitionVideoLightRef.current) captureFrame(transitionVideoLightRef.current, 'light');
  }, []);

  /* ── Apply theme variables ── */
  useEffect(() => {
    const vars = THEMES[theme];
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [theme]);

  /* ── Countdown timer ── */
  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const target = new Date(targetDate + 'T19:00:00');
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  /* ══════════════════════════════════════════════
     THEME TOGGLE — fluid, no black screen
     ══════════════════════════════════════════════ */
const toggleTheme = useCallback(() => {
  if (isTransitioning) return;
  const next = theme === 'light' ? 'dark' : 'light';
  const vid = next === 'dark'
    ? transitionVideoDarkRef.current
    : transitionVideoLightRef.current;
  const overlay = overlayRef.current;
  if (!vid || !overlay) return;

  setIsTransitioning(true);

  // Prepare video
  transitionVideoDarkRef.current.style.display = 'none';
  transitionVideoLightRef.current.style.display = 'none';
  vid.style.display = 'block';
  vid.currentTime = 0;

  // Remove fade-out class, ensure clean state
  overlay.classList.remove('fade-out');

  let themeSwitched = false;

  vid.ontimeupdate = () => {
    if (!themeSwitched && vid.duration && vid.currentTime >= vid.duration / 2) {
      themeSwitched = true;
      const vars = THEMES[next];
      const root = document.documentElement;
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
      document.querySelector('.app-wrapper')?.setAttribute('data-theme', next);
    }
  };

vid.onended = () => {
  vid.ontimeupdate = null;
  vid.onended = null;
  // Sync React state FIRST so hero video switches under the overlay
  setTheme(next);
  // Wait one frame for React to re-render hero video opacity
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Now fade out the overlay — hero is already showing correct video
      overlay.classList.add('fade-out');
      setTimeout(() => {
        vid.style.display = 'none';
        overlay.classList.remove('fade-out');
        setIsTransitioning(false);
      }, 600);
    });
  });
};
  vid.play().catch(() => setIsTransitioning(false));
}, [theme, isTransitioning]);

  // ═══════════ SCROLL ANIMATIONS ═══════════
  const initScrollAnimations = useCallback(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.getAll().forEach(t => t.kill());

      if (heroRef.current) {
        gsap.to(heroContentRef.current, {
          y: -60, opacity: 0, ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: '50% top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      [invitationSideLeftRef, invitationSideRightRef].forEach(ref => {
        if (ref.current) {
          gsap.fromTo(ref.current,
            { height: 0, opacity: 0 },
            {
              height: '10rem', opacity: 0.2, duration: 1.5, ease: 'power2.out',
              scrollTrigger: { trigger: invitationRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
            }
          );
        }
      });

      if (invitationOrnamentTopRef.current) {
        gsap.fromTo(invitationOrnamentTopRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 0.4, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: invitationRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (invitationTextRef.current) {
        const lines = invitationTextRef.current.querySelectorAll('.anim-line');
        gsap.fromTo(lines,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: { trigger: invitationTextRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      }

      gsap.fromTo('.dn-quote-mark.open',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 0.2, duration: 0.8, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: invitationRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo('.dn-quote-mark.close',
        { x: 30, opacity: 0 },
        {
          x: 0, opacity: 0.2, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: invitationRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );

      if (invitationOrnamentBottomRef.current) {
        gsap.fromTo(invitationOrnamentBottomRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 0.4, duration: 1, delay: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: invitationRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
          }
        );
      }

      gsap.to('.dn-invitation-bg-text', {
        y: -80, ease: 'none',
        scrollTrigger: {
          trigger: invitationRef.current, start: 'top bottom', end: 'bottom top', scrub: true,
        },
      });

      if (lieuHeaderRef.current) {
        gsap.fromTo(lieuHeaderRef.current.querySelector('.dn-lieu-title'),
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: lieuRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );
        gsap.fromTo(lieuHeaderRef.current.querySelector('.dn-lieu-subtitle'),
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power3.out',
            scrollTrigger: { trigger: lieuRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (lieuCardRef.current) {
        gsap.fromTo(lieuCardRef.current,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: lieuCardRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
        const cardChildren = lieuCardRef.current.querySelectorAll('.dn-lieu-name, .dn-gold-sep, .dn-lieu-datetime, .dn-lieu-address, .dn-lieu-map-wrapper, .dn-lieu-btn-wrapper');
        gsap.fromTo(cardChildren,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: lieuCardRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (countdownTitleRef.current) {
        gsap.fromTo(countdownTitleRef.current,
          { y: 40, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: countdownRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        );
      }

      gsap.fromTo('.dn-cd-subtitle-row',
        { width: '0%', opacity: 0 },
        {
          width: '100%', opacity: 1, duration: 1, delay: 0.3, ease: 'power2.out',
          scrollTrigger: { trigger: countdownRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );

      if (countdownCardRef.current) {
        gsap.fromTo(countdownCardRef.current,
          { y: 60, opacity: 0, rotateX: 10 },
          {
            y: 0, opacity: 1, rotateX: 0, duration: 1.2, delay: 0.4, ease: 'power3.out',
            scrollTrigger: { trigger: countdownRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
          }
        );
      }

      if (footerRef.current) {
        gsap.fromTo(footerRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
          }
        );
      }

      document.querySelectorAll('.dn-section-border').forEach(border => {
        gsap.fromTo(border,
          { width: '0%' },
          {
            width: '60%', duration: 1.2, ease: 'power2.out',
            scrollTrigger: { trigger: border.parentElement, start: 'top 80%', toggleActions: 'play none none reverse' },
          }
        );
      });

      document.querySelectorAll('.dn-gold-sep').forEach(sep => {
        gsap.fromTo(sep,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: sep, start: 'top 85%', toggleActions: 'play none none reverse' },
          }
        );
      });

      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      initScrollAnimations();
    }
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isOpen, initScrollAnimations]);

  /* ═══════════════════════════════════
     PHASE 1 HANDLER (UNTOUCHED)
     ═══════════════════════════════════ */
  const handleStartTransition = () => {
    if (hasStarted) return;
    setHasStarted(true);

    if (videoRef.current) {
      videoRef.current.play();
    }

    const tl = gsap.timeline();

    tl.to(flashRef.current, {
      opacity: 1, duration: 0.6, delay: 2, ease: "power2.in",
    })
      .call(() => {
        setIsOpen(true);
        window.scrollTo(0, 0);

        if (audioRef.current) {
          audioRef.current.volume = 0.4;
          audioRef.current.play().catch(() => {});
        }
      }, null, "+=0.1")
      .fromTo(mainContentRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
      )
      .to(flashRef.current, {
        opacity: 0, duration: 1.5, ease: "power1.inOut"
      }, "-=1.5");
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="app-wrapper" data-theme={theme}>

      <div ref={flashRef} className="flash-overlay" />
      <audio ref={audioRef} loop preload="auto">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* ── Transition overlay — poster bg prevents black flash ── */}
      <div
        ref={overlayRef}
        className={`dn-transition-overlay ${isTransitioning ? 'active' : ''}`}
      >
        <video
          ref={transitionVideoDarkRef}
          playsInline
          muted
          preload="auto"
          src="/transition-to-dark.mp4"
          style={{ display: 'none' }}
        />
        <video
          ref={transitionVideoLightRef}
          playsInline
          muted
          preload="auto"
          src="/transition-to-light.mp4"
          style={{ display: 'none' }}
        />
      </div>

      {/* ── Fixed Controls (mute + theme) ── */}
      {isOpen && (
        <div className="dn-fixed-controls">
          <button onClick={toggleMute} className="dn-control-btn" aria-label="Toggle musique">
            <div className="dn-control-icon">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </div>
            {!isMuted && (
              <div className="dn-music-bars">
                <span className="dn-bar dn-bar-1" />
                <span className="dn-bar dn-bar-2" />
                <span className="dn-bar dn-bar-3" />
              </div>
            )}
          </button>
          <button onClick={toggleTheme} className="dn-control-btn dn-theme-btn" aria-label="Toggle thème">
            <div className={`dn-theme-icons ${theme === 'dark' ? 'is-dark' : ''}`}>
              <Sun size={18} className="dn-sun-icon" />
              <Moon size={18} className="dn-moon-icon" />
            </div>
          </button>
        </div>
      )}

      {/* --- PHASE 1 : L'OUVERTURE --- */}
      {!isOpen && (
        <div className="ouverture-wrapper" onClick={handleStartTransition}>
          <div
            className={`ouverture-poster ${hasStarted ? 'hidden' : ''}`}
            style={{ backgroundImage: "url('/poster.jpg')" }}
          />
          <video ref={videoRef} className="ouverture-video" playsInline src="/ouverture.mp4" />
        </div>
      )}

      {/* --- PHASE 2 : LE SITE (DAYNIGHT REDESIGN) --- */}
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
            <video
              className="dn-hero-video dn-hero-video--dark"
              autoPlay loop muted playsInline
              src="/darkbg.mp4"
              style={{ opacity: theme === 'dark' ? 1 : 0 }}
            />
          </div>


          <div ref={heroContentRef} className="dn-hero-content">
            <h1 className="dn-hero-title">
              Yacine
              &
              Amel
            </h1>

            <div className="dn-hero-date-block">
              <p className="dn-hero-date">14 AOÛT 2026</p>
            </div>
          </div>

          <div className="dn-scroll-indicator">
            <div className="dn-scroll-line" />
          </div>
        </header>

        {/* ════════════ INVITATION ════════════ */}
        <section ref={invitationRef} className="dn-invitation">
          <div className="dn-invitation-glow" />
          <div ref={invitationSideLeftRef} className="dn-invitation-side-line left" />
          <div ref={invitationSideRightRef} className="dn-invitation-side-line right" />
          <div className="dn-invitation-bg-text">Mariage</div>

          <div className="dn-invitation-content">
            <div ref={invitationOrnamentTopRef} className="dn-ornament">
              <div className="dn-gold-line-r" />
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1 L10.2 6.8 L16 9 L10.2 11.2 L9 17 L7.8 11.2 L2 9 L7.8 6.8 Z" fill="var(--gold)" opacity="0.8" />
              </svg>
              <div className="dn-gold-line-l" />
            </div>

            <div ref={invitationTextRef} className="dn-quote-wrapper">
              <span className="dn-quote-mark open">"</span>
              <p className="dn-invitation-text">
                <span className="anim-line">Dans la joie et la gratitude envers Allah,</span><br />
                <span className="anim-line">nous avons l'honneur de vous convier</span><br />
                <span className="anim-line">à la célébration de notre mariage.</span>
              </p>
              <span className="dn-quote-mark close">"</span>
            </div>

            <div ref={invitationOrnamentBottomRef} className="dn-ornament">
              <div className="dn-gold-line-r" />
              <span className="dn-gold-flower">✿</span>
              <div className="dn-gold-line-l" />
            </div>
          </div>
        </section>

        {/* ════════════ LE LIEU ════════════ */}
        <section ref={lieuRef} className="dn-lieu">
          <div className="dn-section-border top" />
          <div className="dn-section-border bottom" />

          <div ref={lieuHeaderRef} className="dn-lieu-header">
            <p className="dn-lieu-title">Le Lieu</p>
            <p className="dn-lieu-subtitle">Où nous célébrons</p>
          </div>

          <div ref={lieuCardRef} className="dn-lieu-card">
            <div className="dn-lieu-image-wrapper">
              <img src={fleur} alt="Salle Les Roses d'Or" className="dn-lieu-image" />
            </div>

            <div className="dn-lieu-card-body">
              <div className="dn-lieu-name">
                <p className="dn-lieu-name-text">Salle Les Roses d'Or</p>
              </div>

              <div className="dn-gold-sep" />

              <div className="dn-lieu-datetime">
                <p className="dn-lieu-datetime-text">
                  14 Août 2026
                  <span className="dn-lieu-dot">·</span>
                  <span>19:00</span>
                </p>
              </div>

              <div className="dn-gold-sep thin" />

              <div className="dn-lieu-address">
                <p className="dn-lieu-city">Sidi Abdellah</p>
                <p className="dn-lieu-country">Alger, Algérie</p>
              </div>

              <div className="dn-lieu-map-wrapper">
                <iframe
                  title="Location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz"
                  width="100%" height="100%"
                  className="dn-lieu-map"
                  allowFullScreen loading="lazy"
                />
              </div>

              <div className="dn-lieu-btn-wrapper">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="dn-lieu-btn">
                  <Navigation size={14} />
                  Ouvrir l'itinéraire
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ COUNTDOWN ════════════ */}
        <section ref={countdownRef} className="dn-countdown">
          <div className="dn-section-border top" />
          <div className="dn-section-border bottom" />

          <div className="dn-countdown-inner">
            <h2 ref={countdownTitleRef} className="dn-cd-title">Compte à rebours</h2>

            <div className="dn-cd-subtitle-row">
              <div className="dn-cd-sub-line" />
              <p className="dn-cd-subtitle">Jusqu'au jour J</p>
              <div className="dn-cd-sub-line right" />
            </div>

            <div ref={countdownCardRef} className="dn-cd-card">
              <div className="dn-cd-numbers">
                <CountdownUnit value={timeLeft.days} label="Jours" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.hours} label="Heures" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.seconds} label="Secondes" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ FOOTER ════════════ */}
        <footer className="dn-footer">
          <div ref={footerRef} className="dn-footer-inner">
            <p className="dn-footer-families">Familles Belkacem & Mansouri</p>
            <div className="dn-footer-divider" />
            <span className="dn-footer-credit">Made with love by </span>
            <a
              href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3"
              target="_blank"
              rel="noopener noreferrer"
              className="dn-footer-link"
            >
              <span className="dn-footer-credit">Digital Invitation</span>
            </a>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default App;