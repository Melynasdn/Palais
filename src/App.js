import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, Volume2, VolumeX, Heart, Pointer, Navigation } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const videoRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && isOpen) {
        audioRef.current.play().catch(() => console.log("Interaction requise"));
      }
    }
  }, [isMuted, isOpen]);

  const handleStartTransition = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsMuted(false);

    if (videoRef.current) {
      videoRef.current.play();
    }

    const tl = gsap.timeline();

    // Ajustez le delay selon votre vidéo (ex: 2.2s pour l'ouverture totale)
    tl.to(flashRef.current, { 
      opacity: 1, 
      duration: 0.8, 
      delay: 2.2, 
      ease: "power2.in",
      onComplete: () => {
        setIsOpen(true);
        window.scrollTo(0, 0);
      }
    })
    .fromTo(mainContentRef.current, 
      { scale: 1.1, filter: "blur(20px)" }, 
      { scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }
    )
    .to(flashRef.current, { 
      opacity: 0, 
      duration: 1.5,
      ease: "power1.inOut"
    }, "-=1.5");
  };

  return (
    <div className="min-h-screen text-[#4a4238] overflow-x-hidden bg-[#fdfaf5]">
      <script src="https://cdn.tailwindcss.com"></script>

      <audio ref={audioRef} loop src="/musique-mariage.mp3" />
      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {isOpen && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-50 p-4 bg-white/60 backdrop-blur-xl rounded-full border border-[#d4af37]/40 shadow-xl transition-all hover:scale-110 active:scale-90"
        >
          {isMuted ? <VolumeX className="text-[#d4af37]" size={22} /> : <Volume2 className="text-[#d4af37]" size={22} />}
        </button>
      )}

      {/* --- PHASE 1 : SYSTÈME DE SUPERPOSITION ANTI-BLANC --- */}
      {!isOpen && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer bg-[#fdfaf5]"
          onClick={handleStartTransition}
        >
          {/* 1. L'IMAGE FIXE (POSTER) : Visible dès la première seconde */}
          <div 
            className={`absolute inset-0 z-50 bg-cover bg-center transition-opacity duration-1000 ${hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ backgroundImage: "url('/poster.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center">
              <div className="text-center group">
                <Pointer className="text-[#8c7e6a] mx-auto mb-4 animate-bounce" size={40} />
                <span className="text-[#8c7e6a] text-[10px] tracking-[0.6em] uppercase font-light drop-shadow-sm">
                  Appuyez pour ouvrir
                </span>
              </div>
            </div>
          </div>

          {/* 2. LA VIDÉO : En attente sous l'image */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            preload="auto"
            muted={false}
            src="/ouverture.mp4"
          />
        </div>
      )}

      {/* --- PHASE 2 : LE SITE ROYAL --- */}
      <main 
        ref={mainContentRef}
        className={`${isOpen ? 'block' : 'hidden'} relative min-h-screen`}
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.2)), url('/bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <header className="h-[100vh] flex flex-col items-center justify-center text-center px-6">
          <div className="p-12 backdrop-blur-[3px] bg-white/20 rounded-[3rem] border border-white/50 shadow-2xl">
            <h2 className="text-[#b08d57] uppercase tracking-[0.7em] text-[10px] mb-8 font-bold italic">Bismillah Al-Rahman Al-Rahim</h2>
            <h1 className="text-6xl md:text-[9rem] font-calligraphy text-[#4a4238] leading-tight drop-shadow-sm">Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-8 my-10">
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                <Heart className="text-[#d4af37] fill-[#d4af37]/10" size={24} />
                <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            <p className="text-xl md:text-2xl italic font-serif text-[#6b5e4c] tracking-widest">L'union de deux âmes sous la bénédiction d'Allah</p>
          </div>
        </header>

        <section className="py-32 px-6 max-w-6xl mx-auto space-y-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="backdrop-blur-xl bg-white/70 p-14 rounded-[2.5rem] border border-white shadow-xl text-center">
              <Calendar className="text-[#b08d57] mx-auto mb-8" size={40} />
              <p className="text-4xl text-[#4a4238] font-light italic tracking-tighter">Vendredi 14 Août 2026</p>
              <div className="mt-6 inline-block px-6 py-2 border border-[#d4af37]/30 rounded-full text-[10px] tracking-widest text-[#b08d57] font-bold">DÈS 19H00</div>
            </div>
            <div className="backdrop-blur-xl bg-white/70 p-14 rounded-[2.5rem] border border-white shadow-xl text-center">
              <MapPin className="text-[#b08d57] mx-auto mb-8" size={40} />
              <p className="text-4xl text-[#4a4238] font-calligraphy">Salle Les Roses d'Or</p>
              <p className="text-[#8c7e6a] text-[10px] tracking-widest uppercase font-bold">Sidi Abdellah, Alger</p>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/40 p-4 rounded-[3rem] border border-white/60 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center p-8 md:p-12 gap-8">
              <div className="md:w-1/3 text-center md:text-left">
                <h3 className="text-4xl font-calligraphy text-[#b08d57] mb-4">Itinéraire</h3>
                <a 
                  href="https://maps.google.com" // METS TON LIEN ICI
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#d4af37] text-white px-10 py-4 rounded-full hover:bg-[#b08d57] transition-all shadow-lg active:scale-95"
                >
                  <Navigation size={18} />
                  <span className="uppercase text-[10px] tracking-[0.3em] font-bold">Lancer le GPS</span>
                </a>
              </div>
              <div className="md:w-2/3 w-full h-[350px] rounded-[2rem] overflow-hidden border-4 border-white">
                <iframe 
                  title="Google Maps - Salle Les Roses d'Or"
                  src="https://www.google.com/maps/embed?..." // LIEN EMBED ICI
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'sepia(15%) contrast(90%)' }} 
                  allowFullScreen="" 
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="py-24 text-center">
          <p className="text-[#b08d57] text-[10px] uppercase tracking-[0.6em] font-medium opacity-80">Belkacem & Mansouri — 2026</p>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        html, body { 
          margin: 0; 
          padding: 0; 
          background-color: #fdfaf5 !important; 
        }

        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;