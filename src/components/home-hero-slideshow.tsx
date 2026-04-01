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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const syncViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    syncViewport();

    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || slides.length < 2) {
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
  }, [intervalMs, isDesktop, slides.length]);

  if (!isDesktop || !slides.length) {
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
          className={`object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
            index === activeIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
