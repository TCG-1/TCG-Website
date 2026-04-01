"use client";

import { useEffect } from "react";

const REVEAL_DELAY_STEP = 90;
const REVEAL_ROOT_MARGIN = "0px 0px -12% 0px";
const REVEAL_SELECTOR = "section, article, .card, .card-hover, .service-card";

function getRevealTargets(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter((element) => {
    if (element.dataset.scrollRevealSkip === "true") {
      return false;
    }

    return !element.closest("[data-scroll-reveal-skip='true']");
  });
}

export function ScrollRevealController({
  enabled,
  pathname,
}: {
  enabled: boolean;
  pathname: string;
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const root = document.querySelector<HTMLElement>("main[data-scroll-reveal-root='true']");

    if (!root) {
      return;
    }

    const targets = getRevealTargets(root);

    if (!targets.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      targets.forEach((element) => {
        element.classList.remove("scroll-reveal");
        element.classList.add("scroll-reveal-visible");
        element.style.removeProperty("--scroll-reveal-delay");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("scroll-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: REVEAL_ROOT_MARGIN,
        threshold: 0.16,
      },
    );

    targets.forEach((element, index) => {
      const revealDelay = `${(index % 4) * REVEAL_DELAY_STEP}ms`;

      element.style.setProperty("--scroll-reveal-delay", revealDelay);
      element.classList.add("scroll-reveal");

      const startsVisible = element.getBoundingClientRect().top <= window.innerHeight * 0.9;

      if (startsVisible) {
        element.classList.add("scroll-reveal-visible");
        return;
      }

      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled, pathname]);

  return null;
}
