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

  // Gestion du son
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch(() => console.log("L'utilisateur doit interagir d'abord"));
      }
    }
  }, [isMuted]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsMuted(false); // Active le son à l'ouverture

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        window.scrollTo(0, 0);
      }
    });

    tl.to(flashRef.current, { opacity: 1, duration: 0.8, ease: "power2.in" })
      .to(welcomeScreenRef.current, { display: "none", duration: 0 })
      .fromTo(mainContentRef.current, 
        { scale: 1.2, filter: "blur(15px)" }, 
        { scale: 1, filter: "blur(0px)", duration: 1.8, ease: "power2.out" }
      )
      .to(flashRef.current, { opacity: 0, duration: 1.2 }, "-=1.2");
  };

  return (
    <div className="min-h-screen text-[#2c2c2c] overflow-x-hidden selection:bg-[#d4af37]/30">
      <script src="https://cdn.tailwindcss.com"></script>

      {/* --- FICHIER AUDIO --- */}
      <audio ref={audioRef} loop src="/musique-mariage.mp3" />

      {/* --- OVERLAY DE FLASH --- */}
      <div ref={flashRef} className="fixed inset-0 z-[100] bg-white opacity-0 pointer-events-none" />

      {/* --- BOUTON SON --- */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-5 right-5 z-50 p-3 bg-white/80 backdrop-blur-md rounded-full border border-[#d4af37]/40 shadow-xl transition-all hover:scale-110"
      >
        {isMuted ? <VolumeX className="text-[#d4af37]" size={24} /> : <Volume2 className="text-[#d4af37]" size={24} />}
      </button>

      {/* --- PHASE 1 : ENVELOPPE --- */}
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

      {/* --- PHASE 2 : CONTENU ROYAL ALGÉRIEN --- */}
      <main 
        ref={mainContentRef}
        className={`${isOpen ? 'block' : 'hidden'} relative min-h-screen bg-[#fdfaf5]`}
style={{ 
  backgroundImage: `linear-gradient(rgba(253, 250, 245, 0.85), rgba(253, 250, 245, 0.85)), url('/bg.jpg')`,
  backgroundSize: 'cover',        // L'image couvre tout l'espace disponible
  backgroundPosition: 'center',    // L'image est parfaitement centrée
  backgroundAttachment: 'fixed',   // Effet de fixité élégant au scroll (Parallaxe)
  backgroundRepeat: 'no-repeat'    // Empêche l'image de se doubler
}}
      >
        {/* Hero Section */}
        <header className="h-[100vh] flex flex-col items-center justify-center text-center px-6 relative">
          <div className="space-y-6">
            <h2 className="text-[#d4af37] uppercase tracking-[0.5em] text-sm mb-4">Bismillah Al-Rahman Al-Rahim</h2>
            <h1 className="text-7xl md:text-9xl font-calligraphy text-[#1a3a3a]">Yacine & Amel</h1>
            <div className="flex items-center justify-center gap-4 opacity-60">
                <div className="w-12 h-[1px] bg-[#d4af37]"></div>
                <Heart className="text-[#d4af37]" size={15} />
                <div className="w-12 h-[1px] bg-[#d4af37]"></div>
            </div>
            <p className="text-xl italic font-serif text-[#5a4a3a]">L'union de deux âmes, la bénédiction de deux familles</p>
          </div>
        </header>

        {/* Détails Algériens */}
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-calligraphy text-[#d4af37] mb-6">La Fête du Mariage</h3>
            <p className="text-lg leading-relaxed font-serif italic text-gray-700 max-w-2xl mx-auto">
              C'est avec une joie immense que nos parents ont l'honneur de vous convier au dîner de mariage de leurs enfants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Carte Date */}
            <div className="p-12 bg-white/80 border-t-4 border-[#d4af37] shadow-2xl flex flex-col items-center text-center rounded-b-xl">
              <Calendar className="text-[#d4af37] mb-6" size={32} strokeWidth={1} />
              <h4 className="uppercase tracking-widest text-xs font-bold mb-4">Date de la Célébration</h4>
              <p className="font-serif text-2xl">Vendredi 14 Août 2026</p>
              <p className="text-sm italic text-gray-500 mt-2 italic font-serif text-[#d4af37]">Dès 19h00</p>
            </div>
            
            {/* Carte Lieu */}
            <div className="p-12 bg-white/80 border-t-4 border-[#d4af37] shadow-2xl flex flex-col items-center text-center rounded-b-xl">
              <MapPin className="text-[#d4af37] mb-6" size={32} strokeWidth={1} />
              <h4 className="uppercase tracking-widest text-xs font-bold mb-4">Le Palais des Fêtes</h4>
              <p className="font-serif text-2xl">Salle Les Roses d'Or</p>
              <p className="text-sm italic text-gray-500 mt-2">Sidi Abdellah, Alger</p>
            </div>
          </div>
        </section>

        {/* Message de clôture */}
        <section className="py-24 text-center">
            <div className="max-w-xl mx-auto px-6 bg-[#1a3a3a] py-16 rounded-full shadow-2xl border-4 border-[#d4af37]/20">
                <h3 className="text-3xl font-serif text-[#d4af37] mb-4">Votre présence nous honore</h3>
                <p className="text-white/80 italic font-serif px-8 leading-loose">
                    "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité auprès d'elles et Il a mis entre vous de l'affection et de la bonté."
                </p>
            </div>
        </section>

        <footer className="py-12 text-center text-[10px] uppercase tracking-[0.5em] text-[#d4af37]">
          Familles Belkacem & Mansouri — 2026
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .font-calligraphy { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        body { margin: 0; padding: 0; background: #fdfaf5; }
      `}</style>
    </div>
  );
};

export default App;