"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Container } from "@/components/sections";

type FunFactItem = {
  detail?: string;
  label: string;
  value: string;
};

function parseAnimatedValue(value: string) {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  const [, numberPart, suffix] = match;
  const numericValue = Number(numberPart);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  return {
    decimals: numberPart.includes(".") ? numberPart.split(".")[1]?.length ?? 0 : 0,
    suffix,
    value: numericValue,
  };
}

function AnimatedMetric({ value }: { value: string }) {
  const parsedValue = useMemo(() => parseAnimatedValue(value), [value]);
  const [displayValue, setDisplayValue] = useState(() => {
    if (!parsedValue) {
      return value;
    }

    return `${parsedValue.value.toFixed(parsedValue.decimals === 0 ? 0 : parsedValue.decimals).replace(/\.0+$/, "")}${parsedValue.suffix}`;
  });
  const [hasStarted, setHasStarted] = useState(false);
  const metricRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = metricRef.current;

    if (!node || hasStarted || !parsedValue) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasStarted, parsedValue]);

  useEffect(() => {
    if (!hasStarted || !parsedValue) {
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    let frameId = 0;

    const updateFrame = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = parsedValue.value * easedProgress;
      const formattedValue = `${nextValue
        .toFixed(parsedValue.decimals)
        .replace(/\.0+$/, "")}${parsedValue.suffix}`;

      setDisplayValue(formattedValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateFrame);
      }
    };

    frameId = window.requestAnimationFrame(updateFrame);

    return () => window.cancelAnimationFrame(frameId);
  }, [hasStarted, parsedValue]);

  return (
    <div ref={metricRef} className="text-4xl font-extrabold leading-none sm:text-5xl">
      {parsedValue ? displayValue : value}
    </div>
  );
}

export function FunFactCarousel({ items }: { items: FunFactItem[] }) {
  const safeItems = useMemo(() => items.filter((item) => item.value && item.label), [items]);

  if (!safeItems.length) {
    return null;
  }

  return (
    <section className="bg-[#8a0917] py-8 text-white">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">Fun facts</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {safeItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-6 backdrop-blur-sm"
              >
                <AnimatedMetric value={item.value} />
                <div className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
                  {item.label}
                </div>
                {item.detail ? (
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    {item.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
