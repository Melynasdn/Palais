import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, Volume2, VolumeX, Heart, Navigation, Quote } from 'lucide-react';

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
    <div className="min-h-screen text-[#4a4238] overflow-x-hidden bg-[#fdfaf5]">
      <script src="https://cdn.tailwindcss.com"></script>

      <audio ref={audioRef} loop src="/musique-mariage.mp3" />
      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {isOpen && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-50 p-4 bg-white/80 backdrop-blur-md rounded-full border border-[#d4af37]/40 shadow-2xl transition-all hover:scale-110 active:scale-95"
        >
          {isMuted ? <VolumeX className="text-[#d4af37]" size={20} /> : <Volume2 className="text-[#d4af37]" size={20} />}
        </button>
      )}

      {/* --- PHASE 1 : L'OUVERTURE --- */}
      {!isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer bg-[#fdfaf5]" onClick={handleStartTransition}>
          <div 
            className={`absolute inset-0 z-50 bg-cover bg-center transition-opacity duration-1000 ${hasStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ backgroundImage: "url('/poster.jpg')" }}
          >
            
          </div>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline src="/ouverture.mp4" />
        </div>
      )}

      {/* --- PHASE 2 : LE SITE ROYAL --- */}
      <main ref={mainContentRef} className={`${isOpen ? 'block' : 'hidden'} relative min-h-screen bg-[#fdfaf5]`}>
        
        {/* SECTION 1 : HERO (Avec bg.jpg) */}
        <header 
          className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(253,250,245,1)), url('/bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="animate-fade-in-up">
            <h2 className="text-[#b08d57] uppercase tracking-[0.8em] text-[10px] md:text-xs mb-10 font-bold">Bismillah Al-Rahman Al-Rahim</h2>
            <h1 className="text-7xl md:text-[11rem] font-calligraphy text-[#4a4238] leading-tight drop-shadow-sm">Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-6 my-8">
                <div className="w-12 h-[1px] bg-[#d4af37]/50"></div>
                <Heart className="text-[#d4af37] fill-[#d4af37]/20" size={20} strokeWidth={1} />
                <div className="w-12 h-[1px] bg-[#d4af37]/50"></div>
            </div>
            <p className="text-xl md:text-2xl italic font-serif text-[#6b5e4c] tracking-[0.2em]">S'unissent pour l'éternité</p>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#d4af37] to-transparent"></div>
          </div>
        </header>

        {/* SECTION 2 : L'INVITATION (Fond Clair Texturé) */}
        <section className="relative py-32 bg-[#fdfaf5] overflow-hidden">
          {/* Filigrane décoratif en fond */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[20rem] font-calligraphy text-[#d4af37]/5 pointer-events-none select-none">
            Wedding
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Quote className="text-[#d4af37]/30 mx-auto mb-8" size={40} />
            <p className="text-2xl md:text-3xl font-serif italic text-[#4a4238] leading-relaxed mb-12">
              "Dans la joie et la gratitude envers Allah, nous avons l'honneur de vous convier à la célébration de notre mariage."
            </p>
            <div className="w-24 h-[1px] bg-[#d4af37]/40 mx-auto"></div>
          </div>
        </section>

        {/* SECTION 3 : DÉTAILS (Style Cartes Royales) */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="relative p-1 bg-gradient-to-b from-[#d4af37]/40 to-transparent rounded-[2rem]">
                <div className="bg-white p-12 rounded-[1.9rem] text-center shadow-sm">
                  <Calendar className="text-[#b08d57] mx-auto mb-8" size={32} strokeWidth={1.5} />
                  <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-6 text-[#b08d57]">Le Rendez-vous</h4>
                  <p className="text-5xl text-[#4a4238] font-light mb-2 tracking-tighter">14 AOÛT</p>
                  <p className="text-xl text-[#8c7e6a] font-serif italic">Vendredi deux mille vingt-six</p>
                  <p className="mt-6 text-[#4a4238] font-bold tracking-[0.2em] text-xs">À DIX-NEUF HEURES</p>
                </div>
            </div>

            <div className="relative p-1 bg-gradient-to-b from-[#d4af37]/40 to-transparent rounded-[2rem]">
                <div className="bg-white p-12 rounded-[1.9rem] text-center shadow-sm h-full">
                  <MapPin className="text-[#b08d57] mx-auto mb-8" size={32} strokeWidth={1.5} />
                  <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-6 text-[#b08d57]">Le Palais</h4>
                  <p className="text-4xl text-[#4a4238] font-calligraphy mb-2">Salle Les Roses d'Or</p>
                  <p className="text-sm text-[#8c7e6a] tracking-[0.3em] uppercase">Sidi Abdellah, Alger</p>
                  <div className="mt-8 pt-6 border-t border-[#f0e6d2] text-[#b08d57] italic text-sm font-serif">
                    Tenue de fête exigée
                  </div>
                </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 : ITINÉRAIRE (Style Chic) */}
        <section className="py-32 px-6 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-5xl font-calligraphy text-[#4a4238]">Se rendre à la fête</h3>
              <div className="w-12 h-[2px] bg-[#d4af37] mx-auto mt-4"></div>
            </div>
            
            <div className="grid md:grid-cols-12 items-center gap-0 rounded-[3rem] overflow-hidden shadow-2xl border border-[#d4af37]/20 bg-white">
              <div className="md:col-span-4 p-12 bg-[#fdfaf5]">
                <p className="font-serif italic text-[#6b5e4c] mb-10 text-lg">Un service de voiturier sera à votre disposition dès l'entrée du Palais.</p>
                <a 
                  href="https://maps.google.com" 
                  className="flex items-center justify-center gap-3 bg-[#4a4238] text-[#fdfaf5] px-8 py-4 rounded-full hover:bg-[#b08d57] transition-all shadow-xl group"
                >
                  <Navigation size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="uppercase text-[10px] tracking-[0.3em] font-bold">Ouvrir l'itinéraire</span>
                </a>
              </div>
              <div className="md:col-span-8 h-[450px] relative">
                <iframe 
                  title="Location map of Salle Les Roses d'Or in Sidi Abdellah, Alger"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102435.03158784185!2d2.844781662499999!3d36.6480034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128faf9923832d73%3A0x6a1006525797f66e!2sSidi%20Abdellah!5e0!3m2!1sfr!2sdz!4v1700000000000!5m2!1sfr!2sdz"
                  width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(1.1) sepia(0.2)' }} allowFullScreen="" loading="lazy" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER & VERSET */}
        <footer className="py-40 text-center px-6 relative">
          <div className="max-w-2xl mx-auto border-t border-[#d4af37]/30 pt-20">
            <Heart className="text-[#d4af37] mx-auto mb-8 opacity-40" size={24} strokeWidth={1} />
            <p className="text-[#4a4238] font-serif italic text-2xl leading-relaxed mb-12 px-4">
               "Qu'Allah bénisse cette union et nous rassemble dans le bien."
            </p>
            <p className="text-[#b08d57] text-[10px] uppercase tracking-[0.8em] font-bold opacity-70">
              Familles Belkacem & Mansouri
            </p>
          </div>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        html, body { 
          margin: 0; padding: 0; background-color: #fdfaf5 !important; 
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
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;