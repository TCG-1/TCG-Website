"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/sections";

type FunFactItem = {
  value: string;
  label: string;
};

export function FunFactCarousel({ items }: { items: FunFactItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2400);

    return () => {
      window.clearInterval(timer);
    };
  }, [items.length]);

  const activeItem = items[activeIndex];

  return (
    <section className="bg-[#8a0917] py-8 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">Fun facts</p>
          <div className="mt-4 rounded-3xl border border-white/20 bg-white/10 px-8 py-8 backdrop-blur-sm">
            <div className="text-5xl font-extrabold leading-none sm:text-6xl">{activeItem.value}</div>
            <div className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-base">
              {activeItem.label}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-2">
            {items.map((item, index) => (
              <span
                key={item.label}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
