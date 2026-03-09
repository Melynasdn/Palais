import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart} from 'lucide-react';
import bismillah from './assets/bismillah.png';
import fond from './assets/fond.jpg';
import fleur from './assets/fleur.jpg';

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
        <span style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(3.5rem, 10vw, 6rem)',
          color: '#4e0e23',
          lineHeight: 1,
          display: 'block',
          position: 'relative',
          zIndex: 2,
          filter: 'brightness(100%)', // Anti-Dark Mode Hack
        }}>
          {display}
        </span>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(93,18,43,0.08) 0%, transparent 70%)',
          zIndex: 1,
        }} />
      </div>
      <p style={{
        fontSize: '0.55rem',
        letterSpacing: '0.45em',
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#5D122B',
        fontFamily: "'Playfair Display', serif",
        marginTop: '8px',
        opacity: 0.8,
        filter: 'brightness(100%)', // Anti-Dark Mode Hack
      }}>
        {label}
      </p>
    </div>
  );
};

const CountdownSeparator = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '24px',
    opacity: 0.2,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#5D122B' }} />
      <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, #5D122B, transparent)' }} />
    </div>
  </div>
);

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const videoRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);

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
      opacity: 1,
      duration: 0.6,
      delay: 2,
      ease: "power2.in",
    })
      .call(() => {
        setIsOpen(true);
        window.scrollTo(0, 0);
      }, null, "+=0.1")
      .fromTo(mainContentRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
      )
      .to(flashRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power1.inOut"
      }, "-=1.5");
  };

  return (
    <div className="min-h-screen text-[#F2E8E0] overflow-x-hidden bg-[#4B1B1C]">

      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {!isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer bg-[#4B1B1C]" onClick={handleStartTransition}>
          <div
            className={`absolute inset-0 z-50 bg-cover bg-center transition-opacity duration-1000 ${hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ backgroundImage: "url('/poster.jpg')" }}
          />
          <video ref={videoRef} className="w-full h-full object-cover" playsInline src="/ouverture.mp4" />
        </div>
      )}

      <main ref={mainContentRef} className={`${isOpen ? 'block' : 'hidden'} relative min-h-screen bg-[#310102]`}>

        {/* SECTION 1 : HERO */}
        <header
          className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative"
          style={{
            backgroundImage: `url('/bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="animate-fade-in-up">
            <img src={bismillah} alt='Bismillah errahman errahim'
              className="mt-8 ml-3 w-48 md:w-64 mb-6 opacity-80"
              style={{ filter: 'brightness(100%)' }}
            />
            <h1 className="text-4xl md:text-[9rem] font-calligraphy text-[#310102] leading-tight mt-6"
              style={{ textShadow: '0 2px 40px rgba(0, 0, 0, 0.15)', filter: 'brightness(100%)' }}>
              Yacine & Amel
            </h1>
            <div className="flex items-center justify-center gap-6 my-8">
              <div className="w-12 h-[1px] bg-[#5D122B]/30"></div>
              <Heart className="text-[#5D122B] fill-[#5D122B]/10" size={20} strokeWidth={1} style={{ filter: 'brightness(100%)' }} />
              <div className="w-12 h-[1px] bg-[#5D122B]/30"></div>
            </div>
            <p className="text-sm md:text-lg italic font-serif text-[#5D122B] tracking-[0.2em]" style={{ filter: 'brightness(100%)' }}>
              Ont la joie de vous inviter <br /> à célébrer leur union
            </p>
            <p className="mt-4 text-xl text-[#310102] font-serif italic" style={{ filter: 'brightness(100%)' }}>Le Vendredi</p>
            <p className="mt-3 text-2xl text-[#310102] font-light mb-2 tracking-tighter" style={{ filter: 'brightness(100%)' }}>14 AOÛT 2026</p>
            <p className="text-[#310102] font-serif italic tracking-[0.2em] text-xs" style={{ filter: 'brightness(100%)' }}>À 19h</p>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#F2E8E0] to-transparent"></div>
          </div>
        </header>

        {/* SECTION 2 : L'INVITATION */}
        <section className="relative py-32 overflow-hidden" style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 0%, rgba(242,232,224,0.08) 0%, transparent 50%),
            linear-gradient(180deg, #2A0D16 0%, #3D1220 50%, #2A0D16 100%)
          `
        }}>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <p className="text-xl md:text-2xl font-serif italic text-[#F2E8E0]/90 leading-relaxed px-8">
                Dans la joie et la gratitude envers Allah,<br />
                nous avons l'honneur de vous convier<br />
                à la célébration de notre mariage.
            </p>
          </div>
        </section>

        {/* SECTION 4 : LE LIEU */}
        <section
          className="relative py-20 px-6 overflow-hidden"
          style={{ backgroundImage: `url(${fond})` }}
        >
          <div className="text-center mb-10 relative z-10">
            <p className="font-calligraphy text-5xl md:text-6xl mb-3" style={{ color: '#310102', filter: 'brightness(100%)' }}>
              Le Lieu
            </p>
            <p className="text-[10px] tracking-[0.4em] uppercase font-bold"
              style={{ color: '#5D122B', fontFamily: 'Playfair Display, serif', filter: 'brightness(100%)' }}>
              {"Où nous célébrons"}
            </p>
          </div>

          <div
            className="relative z-10 max-w-lg mx-auto rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(160deg, #3D1220 0%, #2A0D16 40%, #1E0A10 100%)`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            }}
          >
            <div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
              <img src={fleur} alt="Salle" className="object-cover mx-auto block mt-8" style={{ width: '100px' }} />
            </div>
            <div className="text-center px-8 pt-4 pb-1">
              <p className="font-calligraphy text-3xl md:text-4xl text-[#F2E8E0]">Salle Les Roses d'Or</p>
            </div>
            <div className="text-center px-8 pb-4">
              <p style={{ color: '#ffffff', fontFamily: 'Playfair Display, serif', fontSize: '0.9rem' }}>
                14 Août 2026 <span className="mx-3 opacity-40">·</span> 19:00
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 : COUNTDOWN */}
        <section style={{
          position: 'relative', padding: '5rem 1.5rem',
          background: `linear-gradient(180deg, #2A0D16 0%, #3D1220 50%, #2A0D16 100%)`,
        }}>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.8rem, 8vw, 4rem)', color: '#fff1f1' }}>
              Compte à rebours
            </h2>
            <div style={{
              margin: '2rem auto', maxWidth: '500px', padding: '2.5rem 1.5rem 2rem', borderRadius: '24px',
              backgroundImage: `url(${fond})`, border: '1px solid rgba(139,106,58,0.12)', backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <CountdownUnit value={timeLeft.days} label="Jours" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.hours} label="Heures" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.minutes} label="Minutes" />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 text-center px-6 relative" style={{ background: '#f5eee7' }}>
          <div className="max-w-2xl mx-auto relative z-10">
            <p className="text-[10px] uppercase tracking-[0.8em] font-bold mb-4" style={{ color: '#5f1616', filter: 'brightness(100%)' }}>
              Familles Belkacem & Mansouri
            </p>
          </div>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          color-scheme: only light; /* Indique au navigateur de ne pas forcer le dark mode */
        }

        html, body { 
          margin: 0; padding: 0; background-color: #4B1B1C !important; 
          scroll-behavior: smooth;
          forced-color-adjust: none; /* Désactive l'ajustement forcé des couleurs sur Windows/Chrome */
        }

        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 2s ease-out forwards; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #F2E8E0; border-radius: 10px; }
        ::-webkit-scrollbar-track { background: #4B1B1C; }
      `}</style>
    </div>
  );
};

export default App;