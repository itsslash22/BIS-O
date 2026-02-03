
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ArrowRight, Instagram, Mail, Calendar } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Craft from './components/Craft';
import Portfolio from './components/Portfolio';
import Ritual from './components/Ritual';
import Schedule from './components/Schedule';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dramatic loading reveal
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black text-white selection:bg-red-700 selection:text-white overflow-x-hidden">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            exit={{ y: '-100%', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: "2em" }}
              animate={{ opacity: 1, letterSpacing: "1em" }}
              className="text-white font-logo text-xl md:text-3xl font-black mb-4 px-4 text-center"
            >
              BISÃO <span className="text-red-700">INK</span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
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
        <Schedule />
      </main>
      <Footer />

      {/* Global Grain Texture - Subtle Layer */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] hidden md:block" />
    </div>
  );
};

export default App;
