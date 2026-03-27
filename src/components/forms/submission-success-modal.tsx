"use client";

import { useEffect } from "react";

type SubmissionSuccessModalProps = {
  message: string;
  onClose: () => void;
  open: boolean;
  title?: string;
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SubmissionSuccessModal({
  message,
  onClose,
  open,
  title = "Submission received",
}: SubmissionSuccessModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-success-title"
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.22)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close success message"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-slate-500 transition hover:border-[#8a0917]/20 hover:text-[#8a0917]"
        >
          <CloseIcon />
        </button>

        <div className="bg-[linear-gradient(135deg,#690711_0%,#8a0917_62%,#b31223_100%)] px-8 pb-8 pt-10 text-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FDD835] text-[#8a0917] shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
            <CheckIcon />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.26em] text-[#FDD835]">
            Tacklers Consulting Group
          </p>
          <h2 id="submission-success-title" className="mt-3 text-3xl font-light tracking-[-0.04em]">
            {title}
          </h2>
        </div>

        <div className="px-8 pb-8 pt-6">
          <p className="text-base leading-8 text-slate-700">{message}</p>
          <button type="button" onClick={onClose} className="button-primary mt-8 w-full justify-center">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
