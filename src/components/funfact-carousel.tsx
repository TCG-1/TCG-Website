"use client";

import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/sections";

type FunFactItem = {
  detail?: string;
  label: string;
  value: string;
};

export function FunFactCarousel({ items }: { items: FunFactItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeItems = useMemo(() => items.filter((item) => item.value && item.label), [items]);

  useEffect(() => {
    if (safeItems.length <= 1 || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeItems.length);
    }, 3800);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, safeItems.length]);

  useEffect(() => {
    if (!safeItems.length) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) => (current >= safeItems.length ? 0 : current));
  }, [safeItems.length]);

  if (!safeItems.length) {
    return null;
  }

  function goToNext() {
    setActiveIndex((prev) => (prev + 1) % safeItems.length);
  }

  function goToPrevious() {
    setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  }

  const activeItem = safeItems[activeIndex];

  return (
    <section className="bg-[#8a0917] py-8 text-white">
      <Container>
        <div
          className="mx-auto max-w-4xl text-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">Fun facts</p>
          <div className="mt-4 rounded-3xl border border-white/20 bg-white/10 px-6 py-8 backdrop-blur-sm sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <button
                type="button"
                onClick={goToPrevious}
                className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-lg font-semibold text-white transition hover:bg-white/16 lg:mx-0"
                aria-label="Previous fun fact"
              >
                ←
              </button>

              <div className="min-h-[11rem]">
                <div className="text-5xl font-extrabold leading-none sm:text-6xl">{activeItem.value}</div>
                <div className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-base">
                  {activeItem.label}
                </div>
                {activeItem.detail ? (
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    {activeItem.detail}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={goToNext}
                className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/8 text-lg font-semibold text-white transition hover:bg-white/16 lg:mx-0"
                aria-label="Next fun fact"
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {safeItems.map((item, index) => (
              <button
                type="button"
                key={item.label}
                onClick={() => setActiveIndex(index)}
                className="group flex items-center gap-2"
                aria-label={`Show fun fact ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                <span
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/35"
                }`}
                />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65 transition group-hover:text-white/90">
                  {item.value}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/55">
            {isPaused ? "Autoplay paused" : "Autoplay active"}
          </p>
        </div>
      </Container>
    </section>
  );
}
