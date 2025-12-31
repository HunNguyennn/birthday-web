import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Hero from './components/Hero';
import ClotheslineGallery from './components/ClotheslineGallery';
import Coupons from './components/Coupons';
import Surprise from './components/Surprise';
import Header from './components/Header';
import ClickHearts from './components/ClickHearts';
import BirthdayCheck from './components/BirthdayCheck';
import MusicPlayer from './components/MusicPlayer';
import VinylRecord from './components/VinylRecord';
import BirthdayCake from './components/BirthdayCake';
import { MusicProvider } from './context/MusicContext';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { FloatingMusic, BokehLights, FloatingGifts, TwinklingStars, FloatingHearts } from './components/BackgroundEffects';
import VideoGallery from './components/VideoGallery';

function App() {
  const [stage, setStage] = useState('check'); // 'check', 'loading', 'content'
  const [isCakeCompleted, setIsCakeCompleted] = useState(false);

  // Auto-scroll to surprise section when cake is finished
  React.useEffect(() => {
    if (isCakeCompleted) {
      setTimeout(() => {
        const titleElement = document.getElementById('letter-title');
        if (titleElement) {
          const targetY = titleElement.getBoundingClientRect().top + window.pageYOffset - 100;
          const currentY = window.scrollY;

          animate(currentY, targetY, {
            duration: 2.5, // Moderate speed
            ease: [0.43, 0.13, 0.23, 0.96], // Smooth cinematic easing
            onUpdate: (latest) => window.scrollTo(0, latest)
          });
        }
      }, 500);
    }
  }, [isCakeCompleted]);

  return (
    <MusicProvider>
      <div className="min-h-screen dreamy-gradient relative overflow-x-hidden text-slate-700">
        <div className="noise-overlay" />
        <ClickHearts />
        <AnimatePresence mode="wait">
          {stage === 'check' && (
            <BirthdayCheck key="check" onCorrect={() => setStage('loading')} />
          )}

          {stage === 'loading' && (
            <LoadingScreen key="loading" onComplete={() => setStage('content')} />
          )}

          {stage === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col w-full"
            >
              <MusicPlayer />
              <Header />

              {/* Hero Section - Magical Sky Theme */}
              {/* Hero Section - Magical Sky Theme */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0c3fc] to-[#8ec5fc] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
              >
                <Hero />
              </motion.section>

              {/* New Vinyl Record Section - Retro Music Theme (Light) */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative z-0 w-full py-24 shadow-sm"
                style={{ background: 'linear-gradient(180deg, #fdfbf7 0%, #dae7f5 100%)' }}
              >
                <FloatingMusic />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none" />
                <VinylRecord />
              </motion.section>

              {/* Clothesline Section - Nostalgic/Cozy Theme */}
              <motion.section
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="relative z-10 w-full bg-[#fdfbf7] py-24 shadow-sm"
              >
                <BokehLights />
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />
                <ClotheslineGallery />
              </motion.section>

              {/* Video Gallery Section - Film/Cinema Theme */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
                className="relative z-10 w-full bg-[#fdfbf7] pb-24 shadow-sm"
              >
                <VideoGallery />
              </motion.section>

              {/* Coupons Section - Playful/Gift Theme */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="relative z-0 w-full bg-gradient-to-br from-pink-50 to-orange-50 py-32"
              >
                <FloatingGifts />
                {/* Decorative top fade */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fdfbf7] to-transparent opacity-50" />
                <Coupons />
              </motion.section>

              {/* Birthday Cake Mission */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full bg-gradient-to-b from-white/60 to-pink-100/50 shadow-sm backdrop-blur-sm"
              >
                <TwinklingStars />
                <BirthdayCake onComplete={() => setIsCakeCompleted(true)} />
              </motion.section>

              {/* Final Surprise revealed after cake */}
              <AnimatePresence>
                {isCakeCompleted && (
                  <motion.section
                    id="surprise-section"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="relative z-20 w-full pb-32 focus-within:z-50 bg-gradient-to-t from-purple-50 to-white pt-20"
                  >
                    <FloatingHearts />
                    <Surprise initialExploded={isCakeCompleted} />
                  </motion.section>
                )}
              </AnimatePresence>

              <footer className="py-10 text-center text-gray-500 glass relative z-20">
                <p className="font-dreamy text-2xl text-pink-500">Made with ❤️ by your favorite person</p>
                <p className="text-xs mt-2 uppercase tracking-widest opacity-50 font-sans">© 2026 - Happy Birthday Cake & Love</p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MusicProvider>
  );
}

export default App;
