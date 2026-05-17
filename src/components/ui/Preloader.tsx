'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Preloader() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const blueLogoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  useGSAP(() => {
    // Slower duration as requested
    const DURATION = 5;

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the preloader container after a brief hold at 100%
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          delay: 0.3, // hold at 100%
          ease: 'power2.inOut',
          onComplete: () => {
            setIsLoading(false);
          },
        });
      },
    });

    // 1. Animate percentage from 0 to 100
    const progressObj = { value: 0 };
    tl.to(progressObj, {
      value: 100,
      duration: DURATION,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (progressRef.current) {
          progressRef.current.innerText = Math.round(progressObj.value).toString();
        }
      }
    }, 'start');

    // 2. Animate the SVG circular loading ring around the logo
    // 301.59 is the circumference of the circle (2 * pi * r where r=48)
    tl.fromTo(
      ringRef.current,
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
      blueLogoRef.current,
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
      logoContainerRef.current,
      { scale: 0.85 },
      {
        scale: 1.05,
        duration: DURATION,
        ease: 'power2.out'
      },
      'start'
    );

  }, { scope: containerRef });

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
    >
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
            transform="rotate(-90 50 50)" // Start drawing from the very top
          />
        </svg>

        {/* Logo Container */}
        <div ref={logoContainerRef} className="relative w-24 h-24 md:w-32 md:h-32">
          {/* Black (Base) Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/om.png"
              alt="Loading Base"
              fill
              className="object-contain brightness-0"
              priority
            />
          </div>

          {/* #16A2FD (Fill) Logo using CSS Mask & Bottom-to-Top Reveal */}
          <div
            ref={blueLogoRef}
            className="absolute inset-0"
            style={{
              WebkitMaskImage: `url('/images/omb.png')`,
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
}
