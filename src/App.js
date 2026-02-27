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
  const [hasStarted, setHasStarted] = useState(false);
  
  const videoRef = useRef(null);
  const flashRef = useRef(null);
  const mainContentRef = useRef(null);
  const audioRef = useRef(null);

  // Gestion de la musique de fond
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && isOpen) {
        audioRef.current.play().catch(() => console.log("L'audio nécessite une interaction"));
      }
    }
  }, [isMuted, isOpen]);

  const handleStartTransition = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsMuted(false);

    // 1. Lancer la vidéo
    if (videoRef.current) {
      videoRef.current.play();
    }

    const tl = gsap.timeline();

    // 2. Attendre la fin de la vidéo (ajuste la durée selon ta vidéo, ici 3s)
    // On lance le flash juste avant la fin de la vidéo
    tl.to(flashRef.current, { 
      opacity: 1, 
      duration: 0.8, 
      delay: 2.2, // Si ta vidéo dure 3s, le flash commence à 2.2s
      ease: "power2.in",
      onComplete: () => {
        setIsOpen(true);
        window.scrollTo(0, 0);
      }
    })
    // 3. Révéler le site avec l'effet de zoom et flou
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
    <div className="min-h-screen text-[#4a4238] overflow-x-hidden bg-white">
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Musique de fond */}
      <audio ref={audioRef} loop src="/musique-mariage.mp3" />

      {/* Flash Blanc de transition */}
      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {/* Bouton Audio */}
      {isOpen && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="fixed top-6 right-6 z-50 p-4 bg-white/40 backdrop-blur-xl rounded-full border border-[#d4af37]/30 shadow-lg transition-all hover:scale-110 active:scale-90"
        >
          {isMuted ? <VolumeX className="text-[#d4af37]" size={22} /> : <Volume2 className="text-[#d4af37]" size={22} />}
        </button>
      )}

      {/* --- PHASE 1 : LA VIDÉO DE L'ENVELOPPE --- */}
      {!isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-white flex items-center justify-center cursor-pointer"
          onClick={handleStartTransition}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted={false} // On laisse le son de la vidéo si elle en a un
            src="/ouverture.mp4"
          />
          
          {/* Overlay discret avant de cliquer */}
{/*           {!hasStarted && (
            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center">
               <div className="">
                  <span className="text-white text-[10px] tracking-[0.5em] uppercase font-light">Appuyez pour ouvrir la  carte</span>
               </div>
            </div>
          )} */}
        </div>
      )}

      {/* --- PHASE 2 : LE SITE ROYAL (THÈME CLAIR) --- */}
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
        {/* Hero Section */}
        <header className="h-[100vh] flex flex-col items-center justify-center text-center px-6">
          <div className="p-12 backdrop-blur-[10px] bg-white/10 rounded-3xl">
            <h2 className="text-[#b08d57] uppercase tracking-[0.6em] text-[11px] mb-6 font-bold italic">Bismillah Al-Rahman Al-Rahim</h2>
            <h1 className="text-7xl md:text-[9rem] font-calligraphy text-[#4a4238] leading-tight">Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-6 my-6 opacity-40">
                <div className="w-16 h-[1px] bg-[#d4af37]"></div>
                <Heart className="text-[#d4af37]" size={18} />
                <div className="w-16 h-[1px] bg-[#d4af37]"></div>
            </div>
            <p className="text-lg md:text-xl italic font-serif text-[#6b5e4c]">L'union de deux âmes sous la grâce d'Allah</p>
          </div>
        </header>

        {/* Détails */}
        <section className="py-32 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="backdrop-blur-md bg-white/60 p-12 rounded-[2rem] border border-white/80 shadow-sm text-center">
              <Calendar className="text-[#b08d57] mb-6 mx-auto" size={35} strokeWidth={1} />
              <h4 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-4 text-[#8c7e6a]">Le Vendredi</h4>
              <p className="text-4xl text-[#4a4238] font-light italic">14 AOÛT 2026</p>
            </div>
            
            <div className="backdrop-blur-md bg-white/60 p-12 rounded-[2rem] border border-white/80 shadow-sm text-center">
              <MapPin className="text-[#b08d57] mb-6 mx-auto" size={35} strokeWidth={1} />
              <h4 className="uppercase tracking-[0.3em] text-[10px] font-bold mb-4 text-[#8c7e6a]">Le Palais des Fêtes</h4>
              <p className="text-4xl text-[#4a4238] font-light italic font-calligraphy">Salle Les Roses d'Or</p>
            </div>
          </div>
        </section>

        {/* Verset */}
        <section className="py-32 flex justify-center px-6">
            <div className="bg-white/40 backdrop-blur-md px-10 py-20 rounded-[3rem] border border-white/60 text-center max-w-3xl">
                <p className="text-[#4a4238] italic font-serif text-lg md:text-2xl leading-relaxed">
                    "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité auprès d'elles..."
                </p>
            </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        body { margin: 0; padding: 0; background: #fff; }
      `}</style>
    </div>
  );
};

export default App;