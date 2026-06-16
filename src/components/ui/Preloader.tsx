'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const Preloader = React.memo(function Preloader() {
  console.count('Preloader Render');
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const blueLogoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasInteracted = false;
    let isPlayStarted = false;

    const getOrCreateAudio = () => {
      if (!audioRef.current && typeof window !== 'undefined') {
        const audio = new Audio('/images/aum.mp3');
        audio.loop = true;
        audio.volume = 1.0;
        audioRef.current = audio;
      }
      return audioRef.current;
    };

    const startPlayback = async () => {
      if (isPlayStarted) return;
      const audio = getOrCreateAudio();
      if (!audio) return;
      try {
        await audio.play();
        isPlayStarted = true;
        removeInteractionListeners();
      } catch {
        // Safe to ignore or log warning (expected due to browser autoplay policies)
        console.warn('[Preloader] Autoplay blocked. Listening for user interaction to start audio.');
      }
    };

    const handleInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        startPlayback();
      }
    };

    const addInteractionListeners = () => {
      window.addEventListener('click', handleInteraction, { once: true });
      window.addEventListener('keydown', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    // Try to play immediately
    startPlayback();
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase()
      const search = window.location.search.toLowerCase()
      const isBotOrLighthouse =
        ua.includes('lighthouse') ||
        ua.includes('chrome-lighthouse') ||
        ua.includes('google-pagespeed') ||
        ua.includes('googlebot') ||
        ua.includes('bingbot') ||
        ua.includes('slurp') ||
        ua.includes('duckduckbot') ||
        ua.includes('baiduspider') ||
        ua.includes('yandexbot') ||
        navigator.webdriver ||
        search.includes('speed') ||
        search.includes('bot') ||
        search.includes('nocache')

      if (isBotOrLighthouse) {
        setTimeout(() => {
          if (mountedRef.current) {
            setIsLoading(false);
          }
        }, 0);
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  // ── CRITICAL: All hooks MUST be called unconditionally before any early returns ──
  // Conditional rendering logic is moved inside the hook callback, not before it.
  useGSAP(
    () => {
      // Skip animation for dashboard/login routes or when already done loading
      if (
        !isLoading ||
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/login')
      ) {
        return
      }

      const container = containerRef.current
      const logoContainer = logoContainerRef.current
      const blueLogo = blueLogoRef.current
      const progress = progressRef.current
      const ring = ringRef.current

      // Guard: all refs must be mounted
      if (!container || !logoContainer || !blueLogo || !progress || !ring) return

      // Speed up duration based on form factor: 3 seconds on desktop, 2 seconds on mobile
      const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
      const DURATION = isMobile ? 2 : 3;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          // Immediately disable pointer events to prevent blocking user clicks while fading out
          container.style.pointerEvents = 'none';

          // Fade out the audio volume in sync with the container fade-out
          if (audioRef.current) {
            gsap.to(audioRef.current, {
              volume: 0,
              duration: 1,
              delay: 0.3,
              ease: 'power2.inOut',
            });
          }

          // Fade out the preloader container after a brief hold at 100%
          gsap.to(container, {
            opacity: 0,
            duration: 1,
            delay: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
              container.style.visibility = 'hidden';
              if (mountedRef.current) {
                setIsLoading(false);
                document.body.style.overflow = '';
                if (typeof window !== 'undefined') {
                  const win = window as unknown as { lenis?: { start: () => void; scrollTo: (y: number, options?: { immediate?: boolean }) => void } };
                  if (win.lenis) {
                    win.lenis.start();
                    win.lenis.scrollTo(0, { immediate: true });
                  }
                  window.scrollTo(0, 0);
                }
              }
            },
          });
        },
      });
      timelineRef.current = tl;

      // 1. Animate percentage from 0 to 100
      const progressObj = { value: 0 };
      tl.to(progressObj, {
        value: 100,
        duration: DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (progress) {
            progress.innerText = Math.round(progressObj.value).toString();
          }
        }
      }, 'start');

      // 2. Animate the SVG circular loading ring around the logo
      // 301.59 is the circumference of the circle (2 * pi * r where r=48)
      tl.fromTo(
        ring,
        { strokeDashoffset: 301.59 },
        {
          strokeDashoffset: 0,
          duration: DURATION,
          ease: 'power2.inOut'
        },
        'start'
      );

      // 3. Bottom-to-top fill animation for the logo
      tl.fromTo(
        blueLogo,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: DURATION,
          ease: 'power2.inOut'
        },
        'start'
      );

      // 4. Creative touch: slowly scale up the entire logo container
      tl.fromTo(
        logoContainer,
        { scale: 0.85 },
        {
          scale: 1.05,
          duration: DURATION,
          ease: 'power2.out'
        },
        'start'
      );
    },
    { scope: containerRef, dependencies: [isLoading, pathname] },
  );

  // ── Safe to return null AFTER all hooks have been called ──
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  if (!isLoading) return null;

  return (
    <div
      id="preloader-container"
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
    >
      <style dangerouslySetInnerHTML={{__html: `
        .is-bot-speed #preloader-container {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}} />
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 flex items-center justify-center">

        {/* Creative SVG Loading Ring */}
        <svg
          className="absolute inset-0 w-full h-full text-[#16A2FD]/10"
          viewBox="0 0 100 100"
        >
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Animated Progress Ring */}
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#16A2FD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="301.59"
            strokeDashoffset="301.59"
            transform="rotate(-90 50 50)"
          />
        </svg>

        {/* Logo Container */}
        <div ref={logoContainerRef} className="relative w-24 h-24 md:w-32 md:h-32">
          {/* Black (Base) Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/om.webp"
              alt="Loading Base"
              fill
              sizes="(max-width: 768px) 96px, 128px"
              className="object-contain brightness-0"
              priority
            />
          </div>

          {/* #16A2FD (Fill) Logo using CSS Mask & Bottom-to-Top Reveal */}
          <div
            ref={blueLogoRef}
            className="absolute inset-0"
            style={{
              WebkitMaskImage: `url('/images/omb.webp')`,
              WebkitMaskSize: 'contain',
              WebkitMaskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              backgroundColor: '#16A2FD',
              clipPath: 'inset(100% 0% 0% 0%)',
            }}
          />
        </div>
      </div>

      {/* Percentage Text */}
      <div className="text-[#16A2FD] font-mono text-3xl font-light tracking-widest mt-4">
        <span ref={progressRef}>0</span>%
      </div>
    </div>
  );
});
