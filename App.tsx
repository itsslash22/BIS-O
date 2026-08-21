import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Craft from './components/Craft';
import Portfolio from './components/Portfolio';
import Ritual from './components/Ritual';
import Quadros from './components/Quadros';
import Schedule from './components/Schedule';
import Footer from './components/Footer';

/**
 * O loader existe para esconder o "flash" das fontes customizadas, não para
 * fazer suspense. Antes ele era um setTimeout fixo de 2s que segurava a
 * primeira tela mesmo quando tudo já estava pronto. Agora sai assim que as
 * fontes carregam, com um teto de 800ms para conexões ruins.
 */
const LOADER_MAX_MS = 800;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setIsLoading(false);
    };

    const cap = setTimeout(finish, LOADER_MAX_MS);
    document.fonts?.ready.then(finish).catch(finish);

    return () => clearTimeout(cap);
  }, []);

  return (
    <div className="relative bg-black text-white selection:bg-red-700 selection:text-white overflow-x-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]"
          >
            <div className="text-white font-logo text-lg md:text-3xl font-black mb-4 px-4 text-center tracking-[0.4em]">
              BISÃO <span className="text-red-700">INK</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ duration: LOADER_MAX_MS / 1000, ease: 'easeInOut' }}
              className="h-[1px] bg-red-700"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      <main>
        <Hero />
        <Craft />
        <Portfolio />
        <Ritual />
        <Quadros />
        <Schedule />
      </main>
      <Footer />

      {/* Textura de grão global */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] hidden md:block" />
    </div>
  );
};

export default App;
