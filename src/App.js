import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, Volume2, VolumeX, Heart, Pointer } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const welcomeScreenRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);
  const waxRef = useRef(null);

  const handleOpen = () => {
    if (isOpen) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        window.scrollTo(0, 0);
      }
    });

    // 1. Le flash blanc s'intensifie et floute la vue
    tl.to(flashRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.in"
    })
    // 2. Disparition discrète de l'enveloppe derrière le blanc
    .to(welcomeScreenRef.current, {
      display: "none",
      duration: 0
    })
    // 3. Zoom arrière et dissipation du flash pour révéler le site
    .fromTo(mainContentRef.current, 
      { scale: 1.2, filter: "blur(10px)" }, 
      { scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
    )
    .to(flashRef.current, {
      opacity: 0,
      duration: 1,
      ease: "power1.inOut"
    }, "-=1.2");
  };

  useEffect(() => {
    if (isOpen) {
      gsap.from(".reveal-item", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reveal-item",
          start: "top 90%",
        }
      });
    }
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#4a4a4a] overflow-x-hidden selection:bg-[#c5a059]/30">
      <script src="https://cdn.tailwindcss.com"></script>

      {/* --- OVERLAY DE FLASH LUMINEUX --- */}
      <div 
        ref={flashRef}
        className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none"
      />

      {/* --- BOUTON AUDIO --- */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-5 right-5 z-50 p-3 bg-white/60 backdrop-blur-md rounded-full border border-[#c5a059]/20 shadow-sm transition-all hover:scale-110 active:scale-90"
      >
        {isMuted ? <VolumeX className="text-[#c5a059]" size={20} /> : <Volume2 className="text-[#c5a059]" size={20} />}
      </button>

      {/* --- PHASE 1 : L'ENVELOPPE (INTRO FIXE) --- */}
      {!isOpen && (
        <div 
          ref={welcomeScreenRef} 
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#f4f1ea]"
        >
          {/* Fond de l'enveloppe */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('/enveloppe-realiste.webp')" }}
          >
            <div className="absolute inset-0 bg-black/5"></div>
          </div>
          
          {/* Sceau de cire - AUCUN MOUVEMENT ICI */}
          <div className="relative z-10 flex flex-col items-center">
            <div 
              ref={waxRef}
              onClick={handleOpen}
              className="cursor-pointer group relative flex items-center justify-center"
              style={{ width: '370px', height: '370px' }}
            >
              <img 
                src="/sceau-ivoire.webp" 
                alt="Sceau M&J" 
                className="w-300 h-300 object-contain drop-shadow-xl transition-transform duration-500 hover:brightness-110"
              />
              <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl animate-pulse -z-10"></div>
              
              <div className="absolute -bottom-10 flex flex-col items-center text-[#8c7e6a] transition-opacity">
                <Pointer className="animate-bounce mb-1" size={18} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-light">Ouvrir l'invitation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PHASE 2 : LE CONTENU AVEC ZOOM REVEAL --- */}
      <main 
        ref={mainContentRef}
        className={`${isOpen ? 'block' : 'hidden'} relative`}
      >
        {/* Section Header */}
        <header className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
          <div className="reveal-item">
            <h2 className="text-[#c5a059] uppercase tracking-[0.4em] text-xs mb-8 italic">M & J</h2>
            <h1 className="text-6xl md:text-8xl font-calligraphy mb-6">Marc & Sophie</h1>
            <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6 opacity-50"></div>
            <p className="text-xl italic font-serif text-[#8c7e6a]">Notre plus belle aventure commence</p>
          </div>

          <div className="absolute bottom-10 animate-bounce opacity-20">
             <div className="w-[1px] h-20 bg-[#c5a059]"></div>
          </div>
        </header>

        {/* Détails */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <div className="reveal-item text-center mb-16">
            <Heart className="mx-auto text-[#c5a059] mb-6 opacity-60" size={30} strokeWidth={1} />
            <h3 className="text-4xl font-calligraphy text-[#c5a059] mb-6">La Cérémonie</h3>
            <p className="text-lg leading-relaxed font-serif italic text-gray-600">
              Dans le cadre enchanteur d'une villa florentine, entourés de cyprès et du parfum des citronniers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 reveal-item">
            <div className="p-12 bg-white/50 backdrop-blur-sm border border-[#c5a059]/10 shadow-sm flex flex-col items-center text-center rounded-sm">
              <Calendar className="text-[#c5a059] mb-4" size={24} strokeWidth={1.5} />
              <h4 className="uppercase tracking-widest text-[10px] font-bold mb-2">Le Rendez-vous</h4>
              <p className="font-serif text-lg">Samedi 14 Juin 2026</p>
              <p className="text-xs italic text-gray-400 mt-1">À partir de 16h30</p>
            </div>
            
            <div className="p-12 bg-white/50 backdrop-blur-sm border border-[#c5a059]/10 shadow-sm flex flex-col items-center text-center rounded-sm">
              <MapPin className="text-[#c5a059] mb-4" size={24} strokeWidth={1.5} />
              <h4 className="uppercase tracking-widest text-[10px] font-bold mb-2">Le Lieu</h4>
              <p className="font-serif text-lg">Villa di Maiano</p>
              <p className="text-xs italic text-gray-400 mt-1">Fiesole, Florence</p>
            </div>
          </div>
        </section>

        {/* Footer RSVP */}
        <section className="py-32 bg-[#f4f1ea]/30 text-center">
          <div className="reveal-item max-w-md mx-auto">
             <h3 className="text-2xl font-serif mb-6 uppercase tracking-[0.2em] text-[#c5a059]">RSVP</h3>
             <p className="mb-10 font-serif italic text-gray-500 px-6 leading-loose">
                Votre présence est le plus beau des cadeaux. Merci de confirmer votre venue.
             </p>
             <button className="bg-[#c5a059] text-white px-12 py-4 rounded-full tracking-[0.3em] text-[10px] uppercase hover:bg-[#a6864a] transition-all shadow-xl active:scale-95">
               Confirmer ma présence
             </button>
          </div>
        </section>

        <footer className="py-12 text-center text-[9px] uppercase tracking-[0.5em] opacity-30">
          M & S — 2026 — Firenze
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        body { margin: 0; padding: 0; background: #fdfaf5; -webkit-font-smoothing: antialiased; }
      `}</style>
    </div>
  );
};

export default App;