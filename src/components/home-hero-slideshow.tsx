"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeroSlide = {
  alt: string;
  src: string;
};

type HomeHeroSlideshowProps = {
  intervalMs?: number;
  slides: HeroSlide[];
};

export function HomeHeroSlideshow({
  intervalMs = 5000,
  slides,
}: HomeHeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs, slides.length]);

  if (!slides.length) {
    return null;
  }

  return (
    <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-[opacity,transform,filter] duration-[1900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
            index === activeIndex
              ? "scale-100 opacity-100 blur-0 hero-bg-kenburns"
              : "scale-[1.06] opacity-0 blur-[2px]"
          }`}
        />
      ))}
    </div>
  );
}
