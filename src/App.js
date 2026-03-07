import React, { useState, useRef,useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Heart, Navigation, Quote } from 'lucide-react';
import bismillah from './assets/bismillah.png';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CountdownNumber = ({ targetDate, unit }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const target = new Date(targetDate + 'T19:00:00');
      const diff = target - now;
      if (diff <= 0) { setValue(0); return; }
      if (unit === 'days') setValue(Math.floor(diff / (1000 * 60 * 60 * 24)));
      if (unit === 'hours') setValue(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      if (unit === 'minutes') setValue(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, unit]);

  return (
    <span className="font-calligraphy" style={{
      fontSize: 'clamp(3rem, 8vw, 5rem)',
      color: '#310102',
      lineHeight: 1,
    }}>
      {value}
    </span>
  );
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const videoRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);

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
      <script src="https://cdn.tailwindcss.com"></script>

      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {/* --- PHASE 1 : L'OUVERTURE --- */}
      {!isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer bg-[#4B1B1C]" onClick={handleStartTransition}>
          <div 
            className={`absolute inset-0 z-50 bg-cover bg-center transition-opacity duration-1000 ${hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ backgroundImage: "url('/poster.jpg')" }}
          >
          </div>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline src="/ouverture.mp4" />
        </div>
      )}

      {/* --- PHASE 2 : LE SITE ROYAL --- */}
      <main ref={mainContentRef} className={`${isOpen ? 'block' : 'hidden'} relative min-h-screen bg-[#310102]`}>
        
        {/* SECTION 1 : HERO */}
        <header 
          className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative"
          style={{  
            backgroundImage: ` url('/bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="animate-fade-in-up">

            <img src={bismillah} alt='Bismillah errahman errahim'
              className="mt-8 ml-3 w-48 md:w-64 mb-6 opacity-80"
            />

            <h1 className="text-4xl md:text-[9rem] font-calligraphy text-[#310102] 
               leading-tight mt-6" style={{ textShadow: '0 2px 40px rgba(0, 0, 0, 0.15)' }}>Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-6 my-8">
                <div className="w-12 h-[1px] bg-[#5D122B]/30"></div>
                <Heart className="text-[#5D122B] fill-[#5D122B]/10" size={20} strokeWidth={1} />
                <div className="w-12 h-[1px] bg-[#5D122B]/30"></div>
            </div>

            <p className="text-sm md:text-lg italic font-serif text-[#5D122B] tracking-[0.2em]">
                  Ont la joie de vous inviter <br/> à célébrer leur union
            </p>

                  <p className=" mt-4 text-xl text-[#310102] font-serif italic"> Le Vendredi</p>
                  <p className="mt-3 text-2xl text-[#310102] font-light mb-2 tracking-tighter">14 AOÛT 2026</p>
                  <p className=" text-[#310102] font-serif italic tracking-[0.2em] text-xs">À 19h</p>

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

  {/* Lueur centrale dorée subtile */}
  <div className="absolute inset-0 pointer-events-none" style={{
    background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)'
  }}></div>

  {/* Lignes ornementales latérales */}
  <div className="absolute left-8 top-1/2 -translate-y-1/2 h-40 w-[1px] opacity-20"
    style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}></div>
  <div className="absolute right-8 top-1/2 -translate-y-1/2 h-40 w-[1px] opacity-20"
    style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}></div>

  {/* Fond "Wedding" watermark — moins visible, plus harmonieux */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 font-calligraphy text-[#F2E8E0]/[0.025] pointer-events-none select-none whitespace-nowrap"
    style={{ fontSize: '18rem', lineHeight: 1 }}>
    Wedding
  </div>

  <div className="max-w-3xl mx-auto px-6 text-center relative z-10">

    {/* Ornement supérieur */}
    <div className="flex items-center justify-center gap-4 mb-10 opacity-40">
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to right, transparent, #C9A84C)' }}></div>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1 L10.2 6.8 L16 9 L10.2 11.2 L9 17 L7.8 11.2 L2 9 L7.8 6.8 Z" 
              fill="#C9A84C" opacity="0.8"/>
      </svg>
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to left, transparent, #C9A84C)' }}></div>
    </div>

    {/* Citation */}
    <div className="relative">
      <span className="font-calligraphy absolute -top-6 -left-2 opacity-20 select-none"
        style={{ fontSize: '6rem', color: '#C9A84C', lineHeight: 1 }}>"</span>

      <p className="text-xl md:text-2xl font-serif italic text-[#F2E8E0]/90 leading-relaxed px-8" style={{
        textShadow: '0 2px 30px rgba(0,0,0,0.3)'
      }}>
        Dans la joie et la gratitude envers Allah,<br/>
        nous avons l'honneur de vous convier<br/>
        à la célébration de notre mariage.
      </p>

      <span className="font-calligraphy absolute -bottom-10 -right-2 opacity-20 select-none"
        style={{ fontSize: '6rem', color: '#C9A84C', lineHeight: 1 }}>"</span>
    </div>

    {/* Ornement inférieur */}
    <div className="flex items-center justify-center gap-4 mt-14 opacity-40">
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to right, transparent, #C9A84C)' }}></div>
      <span style={{ color: '#C9A84C', fontSize: '16px' }}>✿</span>
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to left, transparent, #C9A84C)' }}></div>
    </div>

  </div>
</section>

{/* SECTION 3 : COUNTDOWN */}
<section className="relative py-28 overflow-hidden" style={{
  background: 'linear-gradient(135deg, #F7F0E3 0%, #EDE0C4 40%, #E8D5B0 70%, #F0E6CE 100%)',
}}>

  {/* Lueur centrale */}
  <div className="absolute inset-0 pointer-events-none" style={{
    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,106,58,0.08) 0%, transparent 70%)'
  }}></div>

  {/* Lignes latérales dorées */}
  <div className="absolute left-8 top-1/2 -translate-y-1/2 h-40 w-[1px] opacity-20"
    style={{ background: 'linear-gradient(to bottom, transparent, #8B6A3A, transparent)' }}></div>
  <div className="absolute right-8 top-1/2 -translate-y-1/2 h-40 w-[1px] opacity-20"
    style={{ background: 'linear-gradient(to bottom, transparent, #8B6A3A, transparent)' }}></div>

  <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">

    {/* Ornement supérieur */}
    <div className="flex items-center justify-center gap-4 mb-8 opacity-40">
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to right, transparent, #8B6A3A)' }}></div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0 L8 5 L13 7 L8 9 L7 14 L6 9 L1 7 L6 5 Z" fill="#8B6A3A" opacity="0.8"/>
      </svg>
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to left, transparent, #8B6A3A)' }}></div>
    </div>

    {/* Titre */}
    <p className="font-calligraphy text-5xl md:text-6xl mb-2" style={{ color: '#310102' }}>
      Compte à rebours
    </p>

    {/* Sous-titre */}
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="h-[1px] flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to right, transparent, #8B6A3A)' }}></div>
      <p className="text-[10px] tracking-[0.35em] uppercase font-bold" style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}>
        Jusqu&apos;au 14 Août 2026
      </p>
      <div className="h-[1px] flex-1 max-w-[60px]" style={{ background: 'linear-gradient(to left, transparent, #8B6A3A)' }}></div>
    </div>

    {/* Cadre countdown */}
    <div className="relative mt-8 mx-auto" style={{ maxWidth: '480px' }}>
      {/* Coins dorés */}
      <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C' }}></div>
      <div className="absolute top-0 right-0 w-5 h-5" style={{ borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C' }}></div>
      <div className="absolute bottom-0 left-0 w-5 h-5" style={{ borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C' }}></div>
      <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C' }}></div>
      <div className="absolute inset-0" style={{ border: '1px solid rgba(139,106,58,0.25)' }}></div>

      <div className="px-10 py-10 flex items-center justify-center gap-0">

        {/* Jours */}
        <div className="flex-1 text-center">
          <CountdownNumber targetDate="2026-08-14" unit="days" />
          <p className="text-[9px] tracking-[0.4em] uppercase mt-2 font-bold" style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}>Jours</p>
        </div>

        {/* Séparateur */}
        <div className="pb-6 opacity-25 px-2">
          <div className="w-[1px] h-10" style={{ background: 'linear-gradient(to bottom, transparent, #8B6A3A, transparent)' }}></div>
        </div>

        {/* Heures */}
        <div className="flex-1 text-center">
          <CountdownNumber targetDate="2026-08-14" unit="hours" />
          <p className="text-[9px] tracking-[0.4em] uppercase mt-2 font-bold" style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}>Heures</p>
        </div>

        {/* Séparateur */}
        <div className="pb-6 opacity-25 px-2">
          <div className="w-[1px] h-10" style={{ background: 'linear-gradient(to bottom, transparent, #8B6A3A, transparent)' }}></div>
        </div>

        {/* Minutes */}
        <div className="flex-1 text-center">
          <CountdownNumber targetDate="2026-08-14" unit="minutes" />
          <p className="text-[9px] tracking-[0.4em] uppercase mt-2 font-bold" style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}>Minutes</p>
        </div>

      </div>
    </div>

    {/* Ornement bas */}
    <div className="flex items-center justify-center gap-4 mt-10 opacity-40">
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to right, transparent, #8B6A3A)' }}></div>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0 L8 5 L13 7 L8 9 L7 14 L6 9 L1 7 L6 5 Z" fill="#8B6A3A" opacity="0.7"/>
      </svg>
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to left, transparent, #8B6A3A)' }}></div>
    </div>

  </div>
</section>
{/* SECTION 4 : LE LIEU */}
<section
  className="relative py-20 px-6 overflow-hidden"
  style={{
    background: `
      radial-gradient(ellipse at 20% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 50%, rgba(93,18,43,0.4) 0%, transparent 60%),
      radial-gradient(ellipse at 50% 0%, rgba(242,232,224,0.08) 0%, transparent 50%),
      linear-gradient(180deg, #2A0D16 0%, #3D1220 50%, #2A0D16 100%)
    `,
  }}
>
  {/* Lueur centrale */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
    }}
  ></div>

  {/* Lignes latérales */}
  <div
    className="absolute left-8 top-1/2 -translate-y-1/2 h-40 w-[1px] opacity-20"
    style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}
  ></div>
  <div
    className="absolute right-8 top-1/2 -translate-y-1/2 h-40 w-[1px] opacity-20"
    style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}
  ></div>

  {/* Titre section */}
  <div className="text-center mb-10 relative z-10">
    <p className="font-calligraphy text-5xl md:text-6xl mb-3" style={{ color: '#F2E8E0' }}>
      Le Lieu
    </p>
    <p
      className="text-[10px] tracking-[0.4em] uppercase font-bold"
      style={{ color: '#C9A84C', fontFamily: 'Playfair Display, serif' }}
    >
      {"Où nous célébrons"}
    </p>
    <div className="flex items-center justify-center gap-4 mt-4 opacity-40">
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to right, transparent, #C9A84C)' }}></div>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M6 0 L7 4.5 L11.5 6 L7 7.5 L6 12 L5 7.5 L0.5 6 L5 4.5 Z" fill="#C9A84C" />
      </svg>
      <div className="h-[1px] w-16" style={{ background: 'linear-gradient(to left, transparent, #C9A84C)' }}></div>
    </div>
  </div>

  {/* Carte crème */}
  <div
    className="relative z-10 max-w-lg mx-auto rounded-3xl overflow-hidden"
    style={{
      background: 'linear-gradient(160deg, #FEFCEF 0%, #F7F0E0 60%, #F2E8D5 100%)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.25)',
    }}
  >
    {/* Illustration SVG */}
    {/* Image salle */}
<div className="relative w-full overflow-hidden" style={{ height: '200px' }}>
<img
  src="/fleur.jpg"
  alt="Salle Les Roses d'Or"
  width={200}
  height={150}
  className="object-cover mx-auto block"
  style={{
    filter: 'sepia(0.2) saturate(0.9) brightness(0.9)',
    transform: 'scale(1.05)',
  }}
/>
  {/* Overlay dégradé bas → haut pour fondre sur la carte crème */}
  <div
    className="absolute inset-0"
    style={{
      background: `
        linear-gradient(to bottom,
          rgba(254,252,239,0.15) 0%,
          rgba(254,252,239,0.0) 40%,
          rgba(247,240,224,0.85) 100%
        )
      `,
    }}
  />
  {/* Cadre doré subtil */}
 
</div>

    {/* Nom salle */}
    <div className="text-center px-8 pt-2 pb-1">
      <p className="font-calligraphy text-3xl md:text-4xl" style={{ color: '#310102' }}>
        {"Salle Les Roses d'Or"}
      </p>
    </div>

    <div
      className="mx-10 my-4"
      style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }}
    ></div>

    {/* Date & heure */}
    <div className="text-center px-8 pb-4">
      <p style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
        14 Août 2026
        <span className="mx-3 opacity-40">·</span>
        <span style={{ fontStyle: 'italic' }}>19:00</span>
      </p>
    </div>

    <div
      className="mx-10 my-2"
      style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }}
    ></div>

    {/* Adresse */}
    <div className="text-center px-8 py-5">
      <p className="text-lg font-semibold mb-1" style={{ color: '#310102', fontFamily: 'Playfair Display, serif' }}>
        Sidi Abdellah
      </p>
      <p className="text-sm tracking-wider" style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}>
        {"Alger, Algérie"}
      </p>
    </div>

    {/* Map */}
    <div className="mx-6 rounded-2xl overflow-hidden" style={{ height: '200px', border: '1px solid rgba(201,168,76,0.2)' }}>
      <iframe
        title="Location map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'sepia(0.3) saturate(0.8) brightness(0.95)' }}
        allowFullScreen
        loading="lazy"
      />
    </div>

    {/* Bouton itinéraire */}
    <div className="px-6 py-6">
      <a
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 rounded-full transition-all"
        style={{
          border: '1px solid rgba(139,106,58,0.4)',
          color: '#8B6A3A',
          fontFamily: 'Playfair Display, serif',
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          background: 'transparent',
          textDecoration: 'none',
        }}
      >
        <Navigation size={14} />
        {"Ouvrir l'itinéraire"}
      </a>
    </div>
  </div>
</section>

        {/* FOOTER */}
       

       {/* FOOTER */}
<footer
  className="py-40 text-center px-6 relative"
  style={{
    background: 'linear-gradient(135deg, #F7F0E3 0%, #EDE0C4 40%, #E8D5B0 70%, #F0E6CE 100%)',
  }}
>
  {/* Texture grain */}
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px',
    }}
  ></div>

  {/* Lueur centrale */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,106,58,0.06) 0%, transparent 70%)',
    }}
  ></div>

  <div className="max-w-2xl mx-auto relative z-10">
    {/* Ornement supérieur */}
    <div className="flex items-center justify-center gap-4 mb-12 opacity-40">
      <div
        className="h-[1px] w-16"
        style={{ background: 'linear-gradient(to right, transparent, #8B6A3A)' }}
      ></div>

      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 0 L8 5 L13 7 L8 9 L7 14 L6 9 L1 7 L6 5 Z" fill="#8B6A3A" opacity="0.8" />
      </svg>

      <div
        className="h-[1px] w-16"
        style={{ background: 'linear-gradient(to left, transparent, #8B6A3A)' }}
      ></div>
    </div>

    {/* Coeur */}
    <Heart
      className="mx-auto mb-8 opacity-20"
      size={24}
      strokeWidth={1}
      style={{ color: '#310102' }}
    />

    {/* Citation */}
    <p
      className="font-serif italic text-2xl leading-relaxed mb-12 px-4"
      style={{ color: '#310102' }}
    >
      {"\"Qu'Allah bénisse cette union et nous rassemble dans le bien.\""}
    </p>

    {/* Séparateur */}
    <div className="flex items-center justify-center gap-4 mb-10 opacity-30">
      <div
        className="h-[1px] w-20"
        style={{ background: 'linear-gradient(to right, transparent, #8B6A3A)' }}
      ></div>

      <span style={{ color: '#C9A84C', fontSize: '14px' }}>✿</span>

      <div
        className="h-[1px] w-20"
        style={{ background: 'linear-gradient(to left, transparent, #8B6A3A)' }}
      ></div>
    </div>

    {/* Familles */}
    <p
      className="text-[10px] uppercase tracking-[0.8em] font-bold mb-16 opacity-50"
      style={{ color: '#310102' }}
    >
      Familles Belkacem & Mansouri
    </p>

    {/* Ligne séparatrice */}
    <div
      className="mb-8"
      style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(139,106,58,0.3), transparent)',
      }}
    ></div>

    {/* Made with love */}
     <span
        className="text-[10px] tracking-[0.25em] uppercase font-bold"
        style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}
      >
        {"Made with love by  "}
      </span>
    <a
href="https://www.instagram.com/digital.invites.dz?igsh=ajZkZW41dXlkd3Q3"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-2 transition-all hover:opacity-60"
  style={{ 
    textDecoration: 'none',
    borderBottom: '1px solid rgba(139,106,58,0.4)',
    paddingBottom: '2px',
  }}
>
 

  <Heart size={10} className="fill-current" style={{ color: '#5D122B' }} />

  <span
    className="text-[10px] tracking-[0.25em] uppercase font-bold"
    style={{ color: '#8B6A3A', fontFamily: 'Playfair Display, serif' }}
  >
    {"Digital Invitation"}
  </span>
</a>
  </div>
</footer>



      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        html, body { 
          margin: 0; padding: 0; background-color: #4B1B1C !important; 
          scroll-behavior: smooth;
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