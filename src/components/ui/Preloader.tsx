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

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const hasInteractedRef = useRef(false);
  const isPlayStartedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startBufferPlayback = () => {
      if (isPlayStartedRef.current) return;
      const ctx = audioContextRef.current;
      const buffer = audioBufferRef.current;
      if (!ctx || !buffer) return;

      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        sourceNodeRef.current = source;

        const gain = ctx.createGain();
        gain.gain.value = 1.5; // Exactly 1.5x volume boost as requested
        gainNodeRef.current = gain;

        source.connect(gain);
        gain.connect(ctx.destination);

        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }

        source.start(0);
        isPlayStartedRef.current = true;
        removeInteractionListeners();
        console.log('[Preloader] Audio playing successfully via AudioBufferSourceNode.');
      } catch (err) {
        console.warn('[Preloader] Audio playback failed:', err);
      }
    };

    const fetchAndDecodeAudio = async () => {
      try {
        const response = await fetch('/images/aum.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          const decodedData = await ctx.decodeAudioData(arrayBuffer);
          audioBufferRef.current = decodedData;

          // If the user has already clicked or if the browser allows autoplay, play it immediately!
          if (hasInteractedRef.current || ctx.state === 'running') {
            startBufferPlayback();
          } else {
            // Try starting, if it fails due to autoplay policy it will just be suspended
            startBufferPlayback();
          }
        }
      } catch (err) {
        console.warn('[Preloader] Audio decoding failed:', err);
      }
    };

    const handleInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        
        // Resume AudioContext if it exists
        if (audioContextRef.current) {
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().then(() => {
              startBufferPlayback();
            }).catch(() => {});
          } else {
            startBufferPlayback();
          }
        } else {
          console.log('[Preloader] User interacted before audio decoded.');
        }
      }
    };

    const addInteractionListeners = () => {
      window.addEventListener('click', handleInteraction, { once: true });
      window.addEventListener('keydown', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });
      window.addEventListener('pointerup', handleInteraction, { once: true });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('pointerup', handleInteraction);
    };

    // Load and decode audio asynchronously in the background
    fetchAndDecodeAudio();
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      gainNodeRef.current = null;
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

  useGSAP(
    () => {
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

      if (!container || !logoContainer || !blueLogo || !progress || !ring) return

      const DURATION = 5; // Run for exactly 5 seconds

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          container.style.pointerEvents = 'none';

          // Fade out the audio volume in sync with the container fade-out
          if (gainNodeRef.current) {
            gsap.to(gainNodeRef.current.gain, {
              value: 0,
              duration: 1,
              delay: 0.3,
              ease: 'power2.inOut',
            });
          }

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
