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

    // Ajuste le delay (2.2) selon le moment exact où ton enveloppe est grande ouverte dans ta vidéo
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
    <div className="min-h-screen text-[#4a4238] overflow-x-hidden bg-[#fdfaf5] selection:bg-[#d4af37]/30">
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

      {/* --- PHASE 1 : VIDÉO AVEC CORRECTIF MOBILE --- */}
      {!isOpen && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center cursor-pointer bg-[#fdfaf5]"
          onClick={handleStartTransition}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            preload="auto"
            muted={false}
            poster="/poster.jpg" // IMAGE FIXE QUI ÉVITE L'ÉCRAN BLANC
            src="/ouverture.mp4"
          />
          {!hasStarted && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/5">
               <div className="text-center">
                 <Pointer className="text-[#8c7e6a] mx-auto mb-4 animate-bounce" size={40} />
                 <span className="text-[#8c7e6a] text-[10px] tracking-[0.6em] uppercase font-light">Appuyez pour ouvrir</span>
               </div>
             </div>
          )}
        </div>
      )}

      {/* --- PHASE 2 : SITE ROYAL --- */}
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
        <div className="fixed inset-4 border border-[#d4af37]/20 pointer-events-none z-10 hidden md:block" />

        <header className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative">
          <div className="p-12 backdrop-blur-[3px] bg-white/20 rounded-[3rem] border border-white/50 shadow-2xl">
            <h2 className="text-[#b08d57] uppercase tracking-[0.7em] text-[10px] mb-8 font-bold italic">Bismillah Al-Rahman Al-Rahim</h2>
            <h1 className="text-6xl md:text-[9rem] font-calligraphy text-[#4a4238] leading-tight">Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-8 my-10">
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
                <Heart className="text-[#d4af37] fill-[#d4af37]/10" size={24} strokeWidth={1} />
                <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            <p className="text-xl md:text-2xl italic font-serif text-[#6b5e4c] tracking-widest">L'union de deux âmes sous la bénédiction d'Allah</p>
          </div>
        </header>

        <section className="py-32 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="backdrop-blur-xl bg-white/70 p-14 rounded-[2.5rem] border border-white shadow-xl text-center">
              <Calendar className="text-[#b08d57] mx-auto mb-8" size={40} strokeWidth={1} />
              <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-6 text-[#8c7e6a]">La Célébration</h4>
              <p className="text-4xl text-[#4a4238] font-light italic mb-2 tracking-tighter">Vendredi 14 Août</p>
              <p className="text-[#d4af37] font-serif text-2xl">2026</p>
              <div className="mt-6 inline-block px-6 py-2 border border-[#d4af37]/30 rounded-full text-[10px] tracking-widest text-[#b08d57] font-bold">DÈS 19H00</div>
            </div>
            
            <div className="backdrop-blur-xl bg-white/70 p-14 rounded-[2.5rem] border border-white shadow-xl text-center">
              <MapPin className="text-[#b08d57] mx-auto mb-8" size={40} strokeWidth={1} />
              <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-6 text-[#8c7e6a]">Le Lieu</h4>
              <p className="text-4xl text-[#4a4238] font-calligraphy mb-2">Salle Les Roses d'Or</p>
              <p className="text-[#8c7e6a] text-[10px] tracking-[0.2em] uppercase font-bold">Sidi Abdellah, Alger</p>
            </div>
          </div>
        </section>

        {/* SECTION MAP AMÉLIORÉE */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/40 p-4 rounded-[3rem] border border-white/60 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center p-8 md:p-12 gap-8">
              <div className="md:w-1/3 text-center md:text-left">
                <h3 className="text-4xl font-calligraphy text-[#b08d57] mb-4">Itinéraire</h3>
                <p className="font-serif italic text-[#6b5e4c] mb-8 text-sm leading-relaxed">Le Palais vous attend pour une soirée inoubliable. Cliquez sur le bouton pour lancer le GPS.</p>
                <a 
                  href="https://maps.google.com" // METS TON LIEN GOOGLE MAPS ICI
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#d4af37] text-white px-10 py-4 rounded-full hover:bg-[#b08d57] transition-all shadow-lg active:scale-95"
                >
                  <Navigation size={18} />
                  <span className="uppercase text-[10px] tracking-[0.3em] font-bold">Lancer le GPS</span>
                </a>
              </div>
              <div className="md:w-2/3 w-full h-[350px] rounded-[2rem] overflow-hidden border-4 border-white shadow-inner">
                <iframe 
                  title="Localisation de la salle Les Roses d'Or à Sidi Abdellah, Alger"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102434.37257913499!2d2.86470381669922!3d36.648611100000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128faf7b6928e4e7%3A0xc395ba57d079d86a!2sSidi%20Abdellah!5e0!3m2!1sfr!2sdz!4v1700000000000" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'sepia(10%) contrast(90%) brightness(105%)' }} 
                  allowFullScreen="" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-40 flex justify-center px-6">
            <div className="bg-white/50 backdrop-blur-lg px-12 py-24 rounded-[4rem] border border-white/80 text-center max-w-4xl shadow-2xl relative">
                <Heart className="text-[#d4af37] mx-auto mb-10 opacity-40" size={32} strokeWidth={1} />
                <p className="text-[#4a4238] italic font-serif text-xl md:text-3xl leading-[2] px-4">
                    "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité auprès d'elles..."
                </p>
                <p className="mt-8 text-[#b08d57] uppercase tracking-[0.5em] text-[10px] font-bold">— Sourate Ar-Rum —</p>
            </div>
        </section>

        <footer className="py-24 text-center">
          <p className="text-[#b08d57] text-[10px] uppercase tracking-[0.6em] font-medium opacity-80 italic">Familles Belkacem & Mansouri — 2026</p>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        body { margin: 0; padding: 0; background: #fdfaf5; scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d4af37; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;