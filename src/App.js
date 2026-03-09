import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Navigation } from 'lucide-react';
import bismillah from './assets/bismillah.png';
import fond from './assets/fond.jpg';
import fleur from './assets/fleur.jpg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────
   CANVAS TEXT COMPONENT
   Renders text as a canvas image to resist Chrome Force Dark Mode.
   Chrome cannot invert colors of <img> generated from canvas.
   ───────────────────────────────────────────── */
const CanvasText = ({
  text,
  fontFamily = "'Great Vibes', cursive",
  fontSize = 48,
  color = '#310102',
  bgColor = 'transparent',
  fontWeight = 'normal',
  fontStyle = 'normal',
  letterSpacing = 0,
  lineHeight = 1.3,
  textAlign = 'center',
  maxWidth = 600,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const renderText = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 2;
    const ctx = canvas.getContext('2d');

    // Set font to measure
    const fontStr = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.font = fontStr;

    // Handle multi-line: split by \n or <br>
    const lines = text.split(/\n|<br\s*\/?>/i);

    // Measure each line width with letter spacing
    let maxLineWidth = 0;
    const lineWidths = [];
    for (const line of lines) {
      let w = 0;
      if (letterSpacing && letterSpacing !== 0) {
        for (let i = 0; i < line.length; i++) {
          w += ctx.measureText(line[i]).width + letterSpacing;
        }
      } else {
        w = ctx.measureText(line).width;
      }
      lineWidths.push(w);
      if (w > maxLineWidth) maxLineWidth = w;
    }

    const padding = 20;
    const canvasWidth = Math.min(Math.ceil(maxLineWidth) + padding * 2, maxWidth * dpr);
    const totalHeight = Math.ceil(fontSize * lineHeight * lines.length) + padding * 2;

    canvas.width = canvasWidth * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = totalHeight + 'px';
    ctx.scale(dpr, dpr);

    // Background
    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasWidth, totalHeight);
    } else {
      ctx.clearRect(0, 0, canvasWidth, totalHeight);
    }

    // Draw text
    ctx.font = fontStr;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    lines.forEach((line, i) => {
      const y = padding + i * fontSize * lineHeight;
      let x = padding;

      if (textAlign === 'center') {
        x = (canvasWidth - lineWidths[i]) / 2;
      } else if (textAlign === 'right') {
        x = canvasWidth - lineWidths[i] - padding;
      }

      if (letterSpacing && letterSpacing !== 0) {
        let currentX = x;
        for (let j = 0; j < line.length; j++) {
          ctx.fillText(line[j], currentX, y);
          currentX += ctx.measureText(line[j]).width + letterSpacing;
        }
      } else {
        ctx.fillText(line, x, y);
      }
    });

    setDimensions({ width: canvasWidth, height: totalHeight });
    setImgSrc(canvas.toDataURL('image/png'));
  }, [text, fontFamily, fontSize, color, bgColor, fontWeight, fontStyle, letterSpacing, lineHeight, textAlign, maxWidth]);

  useEffect(() => {
    // Wait for fonts to load before rendering
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        renderText();
      });
    } else {
      setTimeout(renderText, 500);
    }
  }, [renderText]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {imgSrc && (
        <img
          src={imgSrc}
          alt={text}
          width={dimensions.width}
          height={dimensions.height}
          className={className}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            ...style,
          }}
        />
      )}
    </>
  );
};


/* ─────────────────────────────────────────────
   COUNTDOWN
   ───────────────────────────────────────────── */
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
        <CanvasText
          text={display}
          fontFamily="'Great Vibes', cursive"
          fontSize={64}
          color="#4e0e23"
          textAlign="center"
          maxWidth={120}
        />
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(93,18,43,0.08) 0%, transparent 70%)',
          zIndex: -1,
        }} />
      </div>
      <CanvasText
        text={label}
        fontFamily="'Playfair Display', serif"
        fontSize={9}
        color="#5D122B"
        fontWeight="bold"
        letterSpacing={4}
        textAlign="center"
        maxWidth={120}
        style={{ opacity: 0.8, marginTop: '8px' }}
      />
    </div>
  );
};

const CountdownSeparator = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    paddingBottom: '24px', opacity: 0.2,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#5D122B' }} />
      <div style={{ width: '1px', height: '28px', background: 'linear-gradient(to bottom, #5D122B, transparent)' }} />
    </div>
  </div>
);


/* ─────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────── */
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
      opacity: 1, duration: 0.6, delay: 2, ease: "power2.in",
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
        opacity: 0, duration: 1.5, ease: "power1.inOut"
      }, "-=1.5");
  };

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#4B1B1C', color: '#F2E8E0' }}>

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
            cursor: 'pointer', backgroundColor: '#4B1B1C',
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
          position: 'relative', minHeight: '100vh',
          backgroundColor: '#310102',
        }}
      >

        {/* ════════════ SECTION 1 : HERO ════════════ */}
        <header style={{
          height: '100vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 1.5rem',
          position: 'relative',
          backgroundImage: `url('/bg.jpg')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={bismillah} alt='Bismillah errahman errahim'
              style={{ marginTop: '2rem', width: 'min(12rem, 50vw)', marginBottom: '1.5rem', opacity: 0.8 }}
            />
            <CanvasText
              text="Yacine & Amel"
              fontFamily="'Great Vibes', cursive"
              fontSize={72}
              color="#310102"
              textAlign="center"
              maxWidth={600}
              style={{ marginTop: '1.5rem' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', margin: '2rem 0' }}>
              <div style={{ width: '3rem', height: '1px', backgroundColor: 'rgba(93,18,43,0.3)' }}></div>
              <Heart style={{ color: '#5D122B', fill: 'rgba(93,18,43,0.1)' }} size={20} strokeWidth={1} />
              <div style={{ width: '3rem', height: '1px', backgroundColor: 'rgba(93,18,43,0.3)' }}></div>
            </div>
            <CanvasText
              text={"Ont la joie de vous inviter\nà célébrer leur union"}
              fontFamily="'Playfair Display', serif"
              fontSize={16}
              fontStyle="italic"
              color="#5D122B"
              letterSpacing={3}
              textAlign="center"
              maxWidth={400}
            />
            <CanvasText
              text="Le Vendredi"
              fontFamily="'Playfair Display', serif"
              fontSize={20}
              fontStyle="italic"
              color="#310102"
              textAlign="center"
              maxWidth={300}
              style={{ marginTop: '1rem' }}
            />
            <CanvasText
              text="14 AOÛT 2026"
              fontFamily="'Playfair Display', serif"
              fontSize={24}
              fontWeight="300"
              color="#310102"
              letterSpacing={-1}
              textAlign="center"
              maxWidth={300}
              style={{ marginTop: '0.75rem' }}
            />
            <CanvasText
              text="À 19h"
              fontFamily="'Playfair Display', serif"
              fontSize={12}
              fontStyle="italic"
              color="#310102"
              letterSpacing={3}
              textAlign="center"
              maxWidth={200}
              style={{ marginTop: '0.25rem' }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
            <div style={{ width: '1px', height: '4rem', background: 'linear-gradient(to bottom, #F2E8E0, transparent)' }}></div>
          </div>
        </header>

        {/* ════════════ SECTION 2 : L'INVITATION ════════════ */}
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
          <div style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', height: '10rem', width: '1px', opacity: 0.2, background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}></div>
          <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', height: '10rem', width: '1px', opacity: 0.2, background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}></div>

          <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', opacity: 0.4 }}>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to right, transparent, #C9A84C)' }}></div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1 L10.2 6.8 L16 9 L10.2 11.2 L9 17 L7.8 11.2 L2 9 L7.8 6.8 Z" fill="#C9A84C" opacity="0.8" />
              </svg>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to left, transparent, #C9A84C)' }}></div>
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CanvasText
                text={"Dans la joie et la gratitude envers Allah,\nnous avons l'honneur de vous convier\nà la célébration de notre mariage."}
                fontFamily="'Playfair Display', serif"
                fontSize={20}
                fontStyle="italic"
                color="rgba(242,232,224,0.9)"
                textAlign="center"
                lineHeight={1.8}
                maxWidth={500}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3.5rem', opacity: 0.4 }}>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to right, transparent, #C9A84C)' }}></div>
              <span style={{ color: '#C9A84C', fontSize: '16px' }}>✿</span>
              <div style={{ height: '1px', width: '4rem', background: 'linear-gradient(to left, transparent, #C9A84C)' }}></div>
            </div>
          </div>
        </section>

        {/* ════════════ SECTION 3 : LE LIEU ════════════ */}
        <section style={{ position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden', backgroundImage: `url(${fond})` }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', maxWidth: '400px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', maxWidth: '400px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }} />

          <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CanvasText
              text="Le Lieu"
              fontFamily="'Great Vibes', cursive"
              fontSize={56}
              color="#310102"
              textAlign="center"
              maxWidth={400}
              style={{ marginBottom: '0.75rem' }}
            />
            <CanvasText
              text="OÙ NOUS CÉLÉBRONS"
              fontFamily="'Playfair Display', serif"
              fontSize={10}
              fontWeight="bold"
              color="#5D122B"
              letterSpacing={4}
              textAlign="center"
              maxWidth={300}
            />
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

            <div style={{ textAlign: 'center', padding: '1rem 2rem 0.25rem', display: 'flex', justifyContent: 'center' }}>
              <CanvasText
                text="Salle Les Roses d'Or"
                fontFamily="'Great Vibes', cursive"
                fontSize={32}
                color="#F2E8E0"
                textAlign="center"
                maxWidth={400}
              />
            </div>

            <div style={{ margin: '1rem 2.5rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}></div>

            <div style={{ textAlign: 'center', padding: '0 2rem 1rem', display: 'flex', justifyContent: 'center' }}>
              <CanvasText
                text="14 Août 2026  ·  19:00"
                fontFamily="'Playfair Display', serif"
                fontSize={15}
                color="#ffffff"
                textAlign="center"
                maxWidth={300}
              />
            </div>

            <div style={{ margin: '0.5rem 2.5rem', height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}></div>

            <div style={{ textAlign: 'center', padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CanvasText
                text="Sidi Abdellah"
                fontFamily="'Playfair Display', serif"
                fontSize={18}
                fontWeight="600"
                color="#F2E8E0"
                textAlign="center"
                maxWidth={300}
                style={{ marginBottom: '0.25rem' }}
              />
              <CanvasText
                text="Alger, Algérie"
                fontFamily="'Playfair Display', serif"
                fontSize={14}
                color="#fff3d3"
                letterSpacing={1}
                textAlign="center"
                maxWidth={300}
              />
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
                  color: '#ffffff',
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

        {/* ════════════ SECTION 4 : COUNTDOWN ════════════ */}
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

          <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CanvasText
              text="Compte à rebours"
              fontFamily="'Great Vibes', cursive"
              fontSize={48}
              color="#fff1f1"
              textAlign="center"
              maxWidth={500}
              style={{ marginBottom: '0.25rem' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '0.75rem 0 2.5rem' }}>
              <div style={{ height: '1px', flex: 1, maxWidth: '60px', background: 'linear-gradient(to right, transparent, #ffffff)' }} />
              <CanvasText
                text="JUSQU'AU JOUR J"
                fontFamily="'Playfair Display', serif"
                fontSize={9}
                fontWeight="bold"
                color="#fff8fa"
                letterSpacing={4}
                textAlign="center"
                maxWidth={200}
              />
              <div style={{ height: '1px', flex: 1, maxWidth: '60px', background: 'linear-gradient(to left, transparent, #ffffff)' }} />
            </div>

            <div style={{
              position: 'relative', margin: '0 auto', maxWidth: '500px', width: '100%',
              padding: '2.5rem 1.5rem 2rem', borderRadius: '24px',
              backgroundImage: `url(${fond})`,
              border: '1px solid rgba(139,106,58,0.12)',
              boxShadow: '0 4px 30px rgba(49,1,2,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <CountdownUnit value={timeLeft.days} label="JOURS" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.hours} label="HEURES" />
                <CountdownSeparator />
                <CountdownUnit value={timeLeft.minutes} label="MINUTES" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════ FOOTER ════════════ */}
        <footer style={{ padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative', backgroundColor: '#f5eee7' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CanvasText
              text="FAMILLES BELKACEM & MANSOURI"
              fontFamily="'Playfair Display', serif"
              fontSize={10}
              fontWeight="bold"
              color="#5f1616"
              letterSpacing={8}
              textAlign="center"
              maxWidth={500}
              style={{ marginBottom: '1rem' }}
            />

            <div style={{ marginBottom: '2rem', width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <CanvasText
                text="MADE WITH LOVE BY"
                fontFamily="'Playfair Display', serif"
                fontSize={10}
                fontWeight="bold"
                color="#5f1616"
                letterSpacing={3}
                textAlign="center"
                maxWidth={250}
              />
              <a
                href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none', borderBottom: '1px solid #5f1616', paddingBottom: '2px',
                }}
              >
                <CanvasText
                  text="DIGITAL INVITATION"
                  fontFamily="'Playfair Display', serif"
                  fontSize={10}
                  fontWeight="bold"
                  color="#5f1616"
                  letterSpacing={3}
                  textAlign="center"
                  maxWidth={250}
                />
              </a>
            </div>
          </div>
        </footer>

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        html, body {
          margin: 0; padding: 0;
          background-color: #4B1B1C !important;
          scroll-behavior: smooth;
          color-scheme: light dark;
        }

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