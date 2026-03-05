import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin,  Volume2, VolumeX, Heart, Navigation, Quote } from 'lucide-react';

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

      <audio ref={audioRef} loop src="/musique-mariage.mp3" />
      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {isOpen && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-50 p-4 bg-[#3A1415]/80 backdrop-blur-md rounded-full border border-[#F2E8E0]/20 shadow-2xl transition-all hover:scale-110 active:scale-95"
        >
          {isMuted ? <VolumeX className="text-[#F2E8E0]" size={20} /> : <Volume2 className="text-[#F2E8E0]" size={20} />}
        </button>
      )}

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
            backgroundImage: `linear-gradient(to bottom, rgba(95, 68, 68, 0.4), rgb(31, 14, 14)), url('/bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-[11rem] font-calligraphy text-[#F2E8E0] leading-tight mt-10" style={{ textShadow: '0 2px 40px rgba(0, 0, 0, 0.15)' }}>Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-6 my-8">
                <div className="w-12 h-[1px] bg-[#F2E8E0]/30"></div>
                <Heart className="text-[#F2E8E0] fill-[#F2E8E0]/10" size={20} strokeWidth={1} />
                <div className="w-12 h-[1px] bg-[#F2E8E0]/30"></div>
            </div>
            <p className="text-xl md:text-2xl italic font-serif text-[#D4B5A0] tracking-[0.2em]">S'unissent pour l'éternité</p>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#F2E8E0] to-transparent"></div>
          </div>
        </header>

        {/* SECTION 2 : L'INVITATION */}
        <section className="relative py-32 bg-[#350616] overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[20rem] font-calligraphy text-[#F2E8E0]/[0.03] pointer-events-none select-none">
            Wedding
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <Quote className="text-[#F2E8E0]/20 mx-auto mb-8" size={40} />
            <p className="text-1xl md:text-3xl font-serif italic text-[#F2E8E0]/90 leading-relaxed mb-12">
              "Dans la joie et la gratitude envers Allah, nous avons l'honneur de vous convier à la célébration de notre mariage."
            </p>
            <div className="w-24 h-[1px] bg-[#F2E8E0]/20 mx-auto"></div>
          </div>
        </section>

        {/* SECTION 3 : DÉTAILS */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="relative p-1 bg-gradient-to-b from-[#F2E8E0]/20 to-transparent rounded-[2rem]">
                <div className="bg-[#FEFCEF] p-12 rounded-[1.9rem] text-center shadow-sm">
                  <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-6 text-[#310102]">Le Rendez-vous</h4>
                  <p className="text-5xl text-[#350616] font-light mb-2 tracking-tighter">14 AOÛT</p>
                  <p className="text-xl text-[#5D122B] font-serif italic">Vendredi 2026</p>
                  <p className="mt-6 text-[#310102] font-bold tracking-[0.2em] text-xs">À DIX-NEUF HEURES</p>
                </div>
            </div>

            <div className="relative p-1 bg-gradient-to-b from-[#F2E8E0]/20 to-transparent rounded-[2rem]">
                <div className="bg-[#FEFCEF] p-12 rounded-[1.9rem] text-center shadow-sm h-full">
                  <MapPin className="text-[#5D122B] mx-auto mb-8" size={32} strokeWidth={1.5} />
                  <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-6 text-[#310102]">Le Palais</h4>
                  <p className="text-3xl text-[#350616] font-calligraphy mb-2">Salle Les Roses d'Or</p>
                  <p className="text-sm text-[#310102] tracking-[0.3em] uppercase">Sidi Abdellah, Alger</p>
                  
                </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 : ITINÉRAIRE */}
        <section className="py-32 px-6 bg-[#350616]/80">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-calligraphy text-[#F2E8E0]">Se rendre à la fête</h3>
              <div className="w-12 h-[2px] bg-[#F2E8E0]/40 mx-auto mt-4"></div>
            </div>
            
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-[#F2E8E0]/10 bg-[#5C2A2B]">
              <div className="h-[400px] md:h-[450px] relative w-full">
                <iframe 
                  title="Location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d2.8!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQyJzAwLjAiTiAywrA0OCcwMC4wIkU!5e0!3m2!1sfr!2sdz!4v1620000000000!5m2!1sfr!2sdz"
                  width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.35) sepia(0.2) hue-rotate(330deg)' }} allowFullScreen="" loading="lazy" 
                />
              </div>
              <div className="bg-[#310102] px-10 py-10 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
                <a 
                  href="https://maps.google.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center justify-center gap-3 bg-[#F2E8E0] text-[#4B1B1C] px-8 py-4 rounded-full hover:bg-[#FAF7F3] transition-all shadow-xl group"
                >
                  <Navigation size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="uppercase text-[10px] tracking-[0.3em] font-bold">Ouvrir l'itinéraire</span>
                </a>
              </div>
            </div>


          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-40 text-center px-6 relative bg-[#310102]">
          <div className="max-w-2xl mx-auto border-t border-[#F2E8E0]/15 pt-20">
            <Heart className="text-[#F2E8E0] mx-auto mb-8 opacity-30" size={24} strokeWidth={1} />
            <p className="text-[#F2E8E0]/90 font-serif italic text-2xl leading-relaxed mb-12 px-4">
                "Qu'Allah bénisse cette union et nous rassemble dans le bien."
            </p>
            <p className="text-[#D4B5A0] text-[10px] uppercase tracking-[0.8em] font-bold opacity-50">
              Familles Belkacem & Mansouri
            </p>
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