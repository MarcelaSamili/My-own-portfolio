'use client';
import React, { useEffect, useState } from 'react';
import { navItems } from '@/utils/index';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

const Navigation = () => {
  const [isClient, setIsClient] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      setLenis(lenisInstance);

      lenisInstance.on('scroll', ScrollTrigger.update);

      function raf(time: number) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      gsap.ticker.add(time => lenisInstance.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(time => lenisInstance.raf(time * 1000));
      };
    }
  }, [isClient]);

  const scrollToSection = (id: string) => {
    if (lenis) {
      const section = document.getElementById(id);
      if (section) {
        const offsetTop = section.offsetTop;
        lenis.scrollTo(offsetTop);
      }
    }
  };

  return (
    <div className="fixed flex justify-center items-center">
      <nav className="fixed top-[20%] left-0 border-2 backdrop-blur-md p-4 shadow-lg z-50 rounded-[50px] rounded-es-2xl">
        <div className="flex justify-between items-center">
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <motion.div>
                  <button
                    onClick={e => {
                      e.preventDefault();
                      scrollToSection(item.link.replace('#', ''));
                    }}
                    className="bg-bg_secondary font-Cutive-Mono cursor-pointer p-3 py-2 rounded-full transition dalay-150 duration-300 ease-in-out hover:bg-slate-400 hover:translate-y-[2px] hover:scale-110 "
                  ></button>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
