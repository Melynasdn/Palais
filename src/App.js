import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Navigation } from 'lucide-react';
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
          color: 'var(--clr-countdown-num)',
          WebkitTextFillColor: 'var(--clr-countdown-num)',
          lineHeight: 1,
          display: 'block',
          position: 'relative',
          zIndex: 2,
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
        color: 'var(--clr-accent)',
        WebkitTextFillColor: 'var(--clr-accent)',
        fontFamily: "'Playfair Display', serif",
        marginTop: '8px',
        opacity: 0.8,
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
      <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--clr-accent)' }} />
      <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, var(--clr-accent), transparent)' }} />
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
    <div style={{
      minHeight: '100vh',
      overflowX: 'hidden',
      backgroundColor: 'var(--clr-bg-main)',
      color: 'var(--clr-light)',
      WebkitTextFillColor: 'var(--clr-light)',
    }}>

      <div ref={flashRef} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: '#ffffff', opacity: 0, pointerEvents: 'none',
      }} />

      {/* --- PHASE 1 : L'OUVERTURE --- */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backgroundColor: 'var(--clr-bg-main)',
          }}
          onClick={handleStartTransition}
        >
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 50,
              backgroundImage: "url('/poster.jpg')",
              backgroundSize: 'cover', backgroundPosition: 'center',
              transition: 'opacity 1s',
              opacity: hasStarted ? 0 : 1,
              pointerEvents: hasStarted ? 'none' : 'auto',
            }}
          />
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline src="/ouverture.mp4" />
        </div>
      )}

      {/* --- PHASE 2 : LE SITE ROYAL --- */}
      <main
        ref={mainContentRef}
        style={{
          display: isOpen ? 'block' : 'none',
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'var(--clr-bg-section)',
        }}
      >

        {/* SECTION 1 : HERO */}
        <header
          style={{
            height: '100vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 1.5rem',
            position: 'relative',
            backgroundImage: `url('/bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="animate-fade-in-up">
            <img src={bismillah} alt='Bismillah errahman errahim'
              style={{ marginTop: '2rem', marginLeft: '0.75rem', width: 'min(12rem, 50vw)', marginBottom: '1.5rem', opacity: 0.8 }}
            />
            <h1 style={{
              fontSize: 'clamp(2.25rem, 10vw, 9rem)',
              fontFamily: "'Great Vibes', cursive",
              color: 'var(--clr-dark)',
              WebkitTextFillColor: 'var(--clr-dark)',
              lineHeight: 1.1,
              marginTop: '1.5rem',
              textShadow: '0 2px 40px rgba(0, 0, 0, 0.15)',
            }}>
              Yacine & Amel
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', margin: '2rem 0' }}>
              <div style={{ width: '3rem', height: '1px', backgroundColor: 'rgba(93,18,43,0.3)' }}></div>
              <Heart style={{ color: 'var(--clr-accent)', fill: 'rgba(93,18,43,0.1)' }} size={20} strokeWidth={1} />
              <div style={{ width: '3rem', height: '1px', backgroundColor: 'rgba(93,18,43,0.3)' }}></div>
            </div>
            <p style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
              fontStyle: 'italic',
              fontFamily: "'Playfair Display', serif",
              color: 'var(--clr-accent)',
              WebkitTextFillColor: 'var(--clr-accent)',
              letterSpacing: '0.2em',
            }}>
              Ont la joie de vous inviter <br /> à célébrer leur union
            </p>
            <p style={{
              marginTop: '1rem', fontSize: '1.25rem',
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              color: 'var(--clr-dark)', WebkitTextFillColor: 'var(--clr-dark)',
            }}>Le Vendredi</p>
            <p style={{
              marginTop: '0.75rem', fontSize: '1.5rem', fontWeight: 300,
              marginBottom: '0.5rem', letterSpacing: '-0.05em',
              color: 'var(--clr-dark)', WebkitTextFillColor: 'var(--clr-dark)',
            }}>14 AOÛT 2026</p>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              letterSpacing: '0.2em', fontSize: '0.75rem',
              color: 'var(--clr-dark)', WebkitTextFillColor: 'var(--clr-dark)',
            }}>À 19h</p>
          </div>
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
            <div style={{ width: '1px', height: '4rem', background: 'linear-gradient(to bottom, var(--clr-light), transparent)' }}></div>
          </div>
        </header>

        {/* SECTION 2 : L'INVITATION */}
        <section style={{
          position: 'relative', padding: '8rem 0', overflow: 'hidden',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 0%, rgba(242,232,224,0.08) 0%, transparent 50%),
            linear-gradient(180deg, #2A0D16 0%, #3D1220 50%, #2A0D16 100%)
          `,
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', height: '10rem', width: '1px', opacity: 0.2, background: 'linear-gradient(to bottom, transparent, var(--clr-gold), transparent)' }}></div>
          <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', height: '10rem', width: '1px', opacity: 0.2, background: 'linear-gradient(to bottom, transparent, var(--clr-gold), transparent)' }}></div>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            fontFamily: "'Great Vibes', cursive",
            fontSize: '18rem', lineHeight: 1,
            color: 'rgba(242,232,224,0.025)', WebkitTextFillColor: 'rgba(242,232,224,0.025)',
            pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
          }}>Wedding</div>

          <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', opacity: 0.4 }}>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to right, transparent, var(--clr-gold))' }}></div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1 L10.2 6.8 L16 9 L10.2 11.2 L9 17 L7.8 11.2 L2 9 L7.8 6.8 Z" fill="var(--clr-gold)" opacity="0.8" />
              </svg>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to left, transparent, var(--clr-gold))' }}></div>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{
                fontFamily: "'Great Vibes', cursive",
                position: 'absolute', top: '-1.5rem', left: '-0.5rem',
                opacity: 0.2, userSelect: 'none',
                fontSize: '6rem', color: 'var(--clr-gold)', WebkitTextFillColor: 'var(--clr-gold)', lineHeight: 1,
              }}>"</span>
              <p style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                color: 'rgba(242,232,224,0.9)', WebkitTextFillColor: 'rgba(242,232,224,0.9)',
                lineHeight: 1.8, padding: '0 2rem',
                textShadow: '0 2px 30px rgba(0,0,0,0.3)',
              }}>
                Dans la joie et la gratitude envers Allah,<br />
                nous avons l'honneur de vous convier<br />
                à la célébration de notre mariage.
              </p>
              <span style={{
                fontFamily: "'Great Vibes', cursive",
                position: 'absolute', bottom: '-2.5rem', right: '-0.5rem',
                opacity: 0.2, userSelect: 'none',
                fontSize: '6rem', color: 'var(--clr-gold)', WebkitTextFillColor: 'var(--clr-gold)', lineHeight: 1,
              }}>"</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3.5rem', opacity: 0.4 }}>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to right, transparent, var(--clr-gold))' }}></div>
              <span style={{ color: 'var(--clr-gold)', WebkitTextFillColor: 'var(--clr-gold)', fontSize: '16px' }}>✿</span>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to left, transparent, var(--clr-gold))' }}></div>
            </div>
          </div>
        </section>

        {/* SECTION 4 : LE LIEU */}
        <section style={{ position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden', backgroundImage: `url(${fond})` }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', maxWidth: '400px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', maxWidth: '400px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }} />

          <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 10 }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(3rem, 8vw, 3.75rem)', marginBottom: '0.75rem', color: 'var(--clr-dark)', WebkitTextFillColor: 'var(--clr-dark)' }}>
              Le Lieu
            </p>
            <p style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--clr-accent)', WebkitTextFillColor: 'var(--clr-accent)', fontFamily: "'Playfair Display', serif" }}>
              {"Où nous célébrons"}
            </p>
          </div>

          <div style={{
            position: 'relative', zIndex: 10, maxWidth: '32rem', margin: '0 auto',
            borderRadius: '1.5rem', overflow: 'hidden',
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(93,18,43,0.6) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(93,18,43,0.4) 0%, transparent 50%),
              linear-gradient(160deg, #3D1220 0%, #2A0D16 40%, #1E0A10 100%)
            `,
            boxShadow: '0 30px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(201,168,76,0.15), inset 0 1px 0 rgba(201,168,76,0.1)',
          }}>
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: '200px' }}>
              <img src={fleur} alt="Salle Les Roses d'Or" width={100} height={80} style={{ objectFit: 'cover', margin: '2rem auto 0', display: 'block' }} />
            </div>

            <div style={{ textAlign: 'center', padding: '1rem 2rem 0.25rem' }}>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.875rem, 5vw, 2.25rem)', color: 'var(--clr-light)', WebkitTextFillColor: 'var(--clr-light)' }}>
                {"Salle Les Roses d'Or"}
              </p>
            </div>

            <div style={{ margin: '1rem 2.5rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}></div>

            <div style={{ textAlign: 'center', padding: '0 2rem 1rem' }}>
              <p style={{ color: 'var(--clr-white)', WebkitTextFillColor: 'var(--clr-white)', fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                14 Août 2026
                <span style={{ margin: '0 0.75rem', opacity: 0.4 }}>·</span>
                <span style={{ fontStyle: 'italic', color: 'var(--clr-light)', WebkitTextFillColor: 'var(--clr-light)' }}>19:00</span>
              </p>
            </div>

            <div style={{ margin: '0.5rem 2.5rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}></div>

            <div style={{ textAlign: 'center', padding: '1.25rem 2rem' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--clr-light)', WebkitTextFillColor: 'var(--clr-light)', fontFamily: "'Playfair Display', serif" }}>
                Sidi Abdellah
              </p>
              <p style={{ fontSize: '0.875rem', letterSpacing: '0.05em', color: 'var(--clr-address)', WebkitTextFillColor: 'var(--clr-address)', fontFamily: "'Playfair Display', serif" }}>
                {"Alger, Algérie"}
              </p>
            </div>

            <div style={{ margin: '0 1.5rem', borderRadius: '1rem', overflow: 'hidden', height: '200px', border: '1px solid rgba(201,168,76,0.15)' }}>
              <iframe
                title="Location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz"
                width="100%" height="100%"
                style={{ border: 0, filter: 'sepia(0.3) saturate(0.8) brightness(0.85)' }}
                allowFullScreen loading="lazy"
              />
            </div>

            <div style={{ padding: '1.5rem' }}>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  width: '100%', padding: '1rem 0', borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'var(--clr-white)', WebkitTextFillColor: 'var(--clr-white)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.65rem', letterSpacing: '0.35em',
                  textTransform: 'uppercase', fontWeight: 'bold',
                  background: 'transparent', textDecoration: 'none',
                }}
              >
                <Navigation size={14} />
                {"Ouvrir l'itinéraire"}
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3 : COUNTDOWN */}
        <section style={{
          position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden',
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 0%, rgba(242,232,224,0.08) 0%, transparent 50%),
            linear-gradient(180deg, #2A0D16 0%, #3D1220 50%, #2A0D16 100%)
          `,
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px',
          }} />
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', maxWidth: '400px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', maxWidth: '400px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }} />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(2.8rem, 8vw, 4rem)',
              color: 'var(--clr-countdown-title)', WebkitTextFillColor: 'var(--clr-countdown-title)',
              marginBottom: '0.25rem', lineHeight: 1.2,
            }}>
              Compte à rebours
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '0.75rem 0 2.5rem' }}>
              <div style={{ height: '1px', flex: 1, maxWidth: '60px', background: 'linear-gradient(to right, transparent, var(--clr-white))' }} />
              <p style={{
                fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase',
                fontWeight: 700, color: 'var(--clr-countdown-sub)', WebkitTextFillColor: 'var(--clr-countdown-sub)',
                fontFamily: "'Playfair Display', serif", margin: 0,
              }}>
                Jusqu&apos;au jour J
              </p>
              <div style={{ height: '1px', flex: 1, maxWidth: '60px', background: 'linear-gradient(to left, transparent, var(--clr-white))' }} />
            </div>

            <div style={{
              position: 'relative', margin: '0 auto', maxWidth: '500px',
              padding: '2.5rem 1.5rem 2rem', borderRadius: '24px',
              backgroundImage: `url(${fond})`,
              border: '1px solid rgba(139,106,58,0.12)',
              boxShadow: '0 4px 30px rgba(49,1,2,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
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
        <footer style={{ padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative', backgroundColor: 'var(--clr-footer-bg)' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <p style={{
              fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8em',
              fontWeight: 'bold', marginBottom: '1rem',
              color: 'var(--clr-footer)', WebkitTextFillColor: 'var(--clr-footer)',
            }}>
              Familles Belkacem & Mansouri
            </p>

            <div style={{ marginBottom: '2rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }}></div>

            <span style={{
              fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 'bold',
              color: 'var(--clr-footer)', WebkitTextFillColor: 'var(--clr-footer)',
              fontFamily: "'Playfair Display', serif",
            }}>
              {"Made with love by  "}
            </span>
            <a
              href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                textDecoration: 'none', borderBottom: '1px solid var(--clr-footer)', paddingBottom: '2px',
              }}
            >
              <span style={{
                fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 'bold',
                color: 'var(--clr-footer)', WebkitTextFillColor: 'var(--clr-footer)',
                fontFamily: "'Playfair Display', serif",
              }}>
                {"Digital Invitation"}
              </span>
            </a>
          </div>
        </footer>

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        :root {
          color-scheme: light dark;
          --clr-dark: #310102;
          --clr-accent: #5D122B;
          --clr-light: #F2E8E0;
          --clr-white: #ffffff;
          --clr-bg-main: #4B1B1C;
          --clr-bg-section: #310102;
          --clr-gold: #C9A84C;
          --clr-footer: #5f1616;
          --clr-footer-bg: #f5eee7;
          --clr-card-bg: #3D1220;
          --clr-countdown-title: #fff1f1;
          --clr-countdown-sub: #fff8fa;
          --clr-countdown-num: #4e0e23;
          --clr-address: #fff3d3;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --clr-dark: #310102;
            --clr-accent: #5D122B;
            --clr-light: #F2E8E0;
            --clr-white: #ffffff;
            --clr-bg-main: #4B1B1C;
            --clr-bg-section: #310102;
            --clr-gold: #C9A84C;
            --clr-footer: #5f1616;
            --clr-footer-bg: #f5eee7;
            --clr-card-bg: #3D1220;
            --clr-countdown-title: #fff1f1;
            --clr-countdown-sub: #fff8fa;
            --clr-countdown-num: #4e0e23;
            --clr-address: #fff3d3;
          }

          *, *::before, *::after {
            forced-color-adjust: none !important;
            -webkit-text-fill-color: inherit !important;
          }

          html, body {
            background-color: var(--clr-bg-main) !important;
          }

          img, video, iframe, svg, canvas {
            filter: none !important;
          }
        }

        html, body {
          margin: 0; padding: 0;
          background-color: var(--clr-bg-main) !important;
          scroll-behavior: smooth;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 2s ease-out forwards; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: var(--clr-light); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: var(--clr-bg-main); }
     /* When Chrome Force Dark is detected, re-invert everything */
body.chrome-auto-dark {
  filter: invert(1) hue-rotate(180deg) !important;
}
body.chrome-auto-dark img,
body.chrome-auto-dark video,
body.chrome-auto-dark iframe,
body.chrome-auto-dark svg {
  filter: invert(1) hue-rotate(180deg) !important;
}
     
     
     `}</style>
    </div>
  );
};

export default App;