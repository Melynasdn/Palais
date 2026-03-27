import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Navigation, Volume2, VolumeX } from 'lucide-react';
import bismillah from './assets/bismillah.png';
import fond from './assets/fond.jpg';
import fleur from './assets/fleur.jpg';
import './App.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    <div style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
      <div style={{
        position: 'relative',
        display: 'inline-block',
        transform: flip ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <span className="countdown-value">{display}</span>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(93,18,43,0.08) 0%, transparent 70%)',
          zIndex: 1,
        }} />
      </div>
      <p className="countdown-label">{label}</p>
    </div>
  );
};

const CountdownSeparator = () => (
  <div className="countdown-separator">
    <div className="countdown-sep-inner">
      <div className="countdown-sep-dot" />
      <div className="countdown-sep-line" />
    </div>
  </div>
);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);
  const audioRef = useRef(null);
 
  const targetDate = '2026-08-14';

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
    <div className="app-wrapper">

      <div ref={flashRef} className="flash-overlay" />
      <audio ref={audioRef} loop preload="auto">
          <source src="/music.mp3" type="audio/mpeg" />
       </audio>
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

      {/* --- PHASE 2 : LE SITE ROYAL --- */}
      <main ref={mainContentRef} className={`main-content ${!isOpen ? 'hidden' : ''}`}>

        {/* ════════════ HERO ════════════ */}
        <header className="hero" style={{ backgroundImage: `url('/bg.jpg')` }}>
          <div className="hero-content">
            <img src={bismillah} alt="Bismillah errahman errahim" className="hero-bismillah" />
            <h1 className="hero-title">Yacine & Amel</h1>
            <div className="hero-divider">
              <div className="hero-line"></div>
              <Heart style={{ color: '#5D122B', fill: 'rgba(93,18,43,0.1)' }} size={20} strokeWidth={1} />
              <div className="hero-line"></div>
            </div>
            <p className="hero-subtitle">
              Ont la joie de vous inviter <br /> à célébrer leur union
            </p>
            <p className="hero-day">Le Vendredi</p>
            <p className="hero-date">14 AOÛT 2026</p>
            <p className="hero-time">À 19h</p>
          </div>
          <div className="hero-scroll-indicator">
            <div className="hero-scroll-line"></div>
          </div>
        </header>

        {/* ════════════ INVITATION ════════════ */}
        <section className="invitation">
          <div className="invitation-glow"></div>
          <div className="invitation-side-line left"></div>
          <div className="invitation-side-line right"></div>
          <div className="invitation-bg-text">Wedding</div>

          <div className="invitation-content">
            <div className="invitation-ornament top">
              <div className="gold-line-right"></div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1 L10.2 6.8 L16 9 L10.2 11.2 L9 17 L7.8 11.2 L2 9 L7.8 6.8 Z" fill="#C9A84C" opacity="0.8" />
              </svg>
              <div className="gold-line-left"></div>
            </div>

            <div className="invitation-quote-wrapper">
              <span className="invitation-quote-mark open">"</span>
              <p className="invitation-text">
                Dans la joie et la gratitude envers Allah,<br />
                nous avons l'honneur de vous convier<br />
                à la célébration de notre mariage.
              </p>
              <span className="invitation-quote-mark close">"</span>
            </div>

            <div className="invitation-ornament bottom">
              <div className="gold-line-right"></div>
              <span className="gold-flower">✿</span>
              <div className="gold-line-left"></div>
            </div>
          </div>
        </section>

        {/* ════════════ LE LIEU ════════════ */}
        <section className="lieu" style={{ backgroundImage: `url(${fond})` }}>
          <div className="lieu-border top"></div>
          <div className="lieu-border bottom"></div>

          <div className="lieu-header">
            <p className="lieu-title">Le Lieu</p>
            <p className="lieu-subtitle">Où nous célébrons</p>
          </div>

          <div className="lieu-card">
            <div className="lieu-image-wrapper">
              <img src={fleur} alt="Salle Les Roses d'Or" width={100} height={80} className="lieu-image" />
            </div>

            <div className="lieu-name">
              <p className="lieu-name-text">Salle Les Roses d'Or</p>
            </div>

            <div className="gold-separator"></div>

            <div className="lieu-datetime">
              <p className="lieu-datetime-text">
                14 Août 2026
                <span className="lieu-datetime-dot">·</span>
                <span className="lieu-datetime-time">19:00</span>
              </p>
            </div>

            <div className="gold-separator thin"></div>

            <div className="lieu-address">
              <p className="lieu-city">Sidi Abdellah</p>
              <p className="lieu-country">Alger, Algérie</p>
            </div>

            <div className="lieu-map-wrapper">
              <iframe
                title="Location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz"
                width="100%" height="100%"
                className="lieu-map"
                allowFullScreen loading="lazy"
              />
            </div>

            <div className="lieu-btn-wrapper">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="lieu-btn">
                <Navigation size={14} />
                Ouvrir l'itinéraire
              </a>
            </div>
          </div>
        </section>

        {/* ════════════ COUNTDOWN ════════════ */}
        <section className="countdown">
          <div className="countdown-texture"></div>
          <div className="countdown-border top"></div>
          <div className="countdown-border bottom"></div>

          <div className="countdown-inner">
            <h2 className="countdown-title">Compte à rebours</h2>

            <div className="countdown-subtitle-row">
              <div className="countdown-subtitle-line-right"></div>
              <p className="countdown-subtitle">Jusqu'au jour J</p>
              <div className="countdown-subtitle-line-left"></div>
            </div>

            <div className="countdown-card" style={{ backgroundImage: `url(${fond})` }}>
              <div className="countdown-numbers">
                <CountdownUnit value={timeLeft.days} label="Jours" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.hours} label="Heures" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ FOOTER ════════════ */}
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-families">Familles Belkacem & Mansouri</p>
            <div className="footer-divider"></div>
            <span className="footer-credit">Made with love by </span>
            <a
              href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <span className="footer-credit">Digital Invitation</span>
            </a>
          </div>

          
        </footer>
        {/* Bouton Mute/Unmute */}

      </main>
      {isOpen && (
  <button onClick={toggleMute} className="music-toggle">
    <div className="music-toggle-icon">
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </div>
    {!isMuted && (
      <div className="music-bars">
        <span className="bar bar-1" />
        <span className="bar bar-2" />
        <span className="bar bar-3" />
      </div>
    )}
  </button>
)}
    </div>
  );
};

export default App;