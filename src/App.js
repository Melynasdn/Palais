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
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch(() => console.log("Interaction requise"));
      }
    }
  }, [isMuted]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsMuted(false);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        window.scrollTo(0, 0);
      }
    });

    tl.to(flashRef.current, { opacity: 1, duration: 0.8, ease: "power2.in" })
      .to(welcomeScreenRef.current, { display: "none", duration: 0 })
      .fromTo(mainContentRef.current, 
        { scale: 1.1, filter: "blur(20px)" }, 
        { scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }
      )
      .to(flashRef.current, { opacity: 0, duration: 1.5 }, "-=1.5");
  };

  return (
    <div className="min-h-screen text-[#4a4238] overflow-x-hidden selection:bg-[#d4af37]/20">
      <script src="https://cdn.tailwindcss.com"></script>

      <audio ref={audioRef} loop src="/musique-mariage.mp3" />
      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {/* --- BOUTON SON ÉLÉGANT --- */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-6 right-6 z-50 p-4 bg-white/40 backdrop-blur-xl rounded-full border border-[#d4af37]/30 shadow-lg transition-all hover:scale-110 active:scale-90"
      >
        {isMuted ? <VolumeX className="text-[#d4af37]" size={22} /> : <Volume2 className="text-[#d4af37]" size={22} />}
      </button>

      {/* --- PHASE 1 : ENVELOPPE (INCHANGÉE) --- */}
      {!isOpen && (
        <div ref={welcomeScreenRef} className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/enveloppe-realiste.webp')" }} />
          <div className="relative z-10">
            <div onClick={handleOpen} className="cursor-pointer group relative flex items-center justify-center" style={{ width: '370px', height: '370px' }}>
              <img src="/sceau-ivoire.webp" alt="Sceau" className="w-370 h-370 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl animate-pulse -z-10" />
              <div className="absolute -bottom-10 flex flex-col items-center text-[#8c7e6a]">
                <Pointer className="animate-bounce mb-1" size={18} />
                <span className="text-[10px] tracking-[0.4em] uppercase font-light">Ouvrir l'Invitation</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PHASE 2 : CONTENU LUMINEUX & ROYAL --- */}
      <main 
        ref={mainContentRef}
        className={`${isOpen ? 'block' : 'hidden'} relative min-h-screen`}
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.2)), url('/bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Hero Section vaporeuse */}
        <header className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative">
          <div className="p-12 backdrop-blur-[2px] bg-white/10 rounded-3xl">
            <h2 className="text-[#b08d57] uppercase tracking-[0.6em] text-[11px] mb-6 font-bold">Bismillah Al-Rahman Al-Rahim</h2>
            <h1 className="text-7xl md:text-[9rem] font-calligraphy text-[#4a4238] leading-tight drop-shadow-sm">Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-6 my-6">
                <div className="w-16 h-[1px] bg-[#d4af37]/40"></div>
                <Heart className="text-[#d4af37]/60 fill-[#d4af37]/5" size={18} strokeWidth={1} />
                <div className="w-16 h-[1px] bg-[#d4af37]/40"></div>
            </div>
            <p className="text-lg md:text-xl italic font-serif text-[#6b5e4c] tracking-[0.1em]">L'union de deux âmes sous la grâce d'Allah</p>
          </div>
          
          <div className="absolute bottom-12 animate-pulse">
             <div className="w-[1px] h-20 bg-gradient-to-b from-[#d4af37] to-transparent"></div>
          </div>
        </header>

        {/* Détails en Glassmorphism Clair */}
        <section className="py-32 px-6 max-w-6xl mx-auto relative z-20">
          <div className="text-center mb-20">
            <h3 className="text-5xl md:text-6xl font-calligraphy text-[#b08d57] mb-6">La Fête du Mariage</h3>
            <p className="text-lg leading-relaxed font-serif italic text-[#4a4238] max-w-2xl mx-auto">
              C'est avec une immense joie que les familles Belkacem & Mansouri vous invitent à partager leur bonheur.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Date */}
            <div className="backdrop-blur-md bg-white/60 p-12 rounded-[2rem] border border-white/80 shadow-sm flex flex-col items-center text-center group transition-all hover:bg-white/80">
              <Calendar className="text-[#b08d57] mb-6 opacity-80" size={35} strokeWidth={1} />
              <h4 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-4 text-[#8c7e6a]">Le Vendredi</h4>
              <p className="text-4xl text-[#4a4238] font-light tracking-tighter">14 AOÛT 2026</p>
              <p className="mt-4 text-[#b08d57] font-serif italic uppercase text-xs tracking-widest">À partir de 19h00</p>
            </div>
            
            {/* Lieu */}
            <div className="backdrop-blur-md bg-white/60 p-12 rounded-[2rem] border border-white/80 shadow-sm flex flex-col items-center text-center group transition-all hover:bg-white/80">
              <MapPin className="text-[#b08d57] mb-6 opacity-80" size={35} strokeWidth={1} />
              <h4 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-4 text-[#8c7e6a]">Le Palais des Fêtes</h4>
              <p className="text-4xl text-[#4a4238] font-light tracking-tighter italic font-calligraphy">Salle Les Roses d'Or</p>
              <p className="text-xs text-[#8c7e6a] mt-4 tracking-widest uppercase">Sidi Abdellah, Alger</p>
            </div>
          </div>
        </section>

        {/* Message Spirituel Final */}
        <section className="py-32 flex justify-center px-6">
            <div className="bg-white/40 backdrop-blur-md px-10 py-20 rounded-[3rem] border border-white/60 text-center max-w-3xl shadow-xl">
                <Heart className="text-[#d4af37] mx-auto mb-8 opacity-40" size={30} strokeWidth={1} />
                <h3 className="text-xl font-serif text-[#b08d57] mb-8 uppercase tracking-[0.3em]">Votre présence nous honore</h3>
                <p className="text-[#4a4238] italic font-serif text-lg md:text-2xl px-4 leading-relaxed">
                    "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité auprès d'elles et Il a mis entre vous de l'affection et de la bonté."
                </p>
            </div>
        </section>

        <footer className="py-20 text-center">
          <p className="text-[#b08d57] text-[10px] uppercase tracking-[0.5em] font-medium opacity-70">Familles Belkacem & Mansouri — 2026</p>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        body { margin: 0; padding: 0; background: #fff; }
        main { transition: opacity 1s ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;