"use client";

import { useEffect, useState, useTransition } from "react";

import { DASHBOARD_ICON_NAMES, getDefaultClientHubContent } from "@/lib/client-hub";

type Notice = { type: "success" | "error"; message: string } | null;

export function ClientHubManager() {
  const [draft, setDraft] = useState("");
  const [savedDraft, setSavedDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isActive = true;

    async function loadContent() {
      try {
        const response = await fetch("/api/admin/client-hub", { cache: "no-store" });
        const payload = (await response.json()) as {
          configured?: boolean;
          content?: unknown;
          error?: string;
        };

        if (!isActive) return;

        const formatted = JSON.stringify(payload.content ?? getDefaultClientHubContent(), null, 2);
        setDraft(formatted);
        setSavedDraft(formatted);
        setConfigured(Boolean(payload.configured));
        setLoadError(payload.error ?? null);
      } catch {
        if (!isActive) return;
        setLoadError("Unable to load the client hub content right now.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadContent();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="card">
          <p className="eyebrow">Dashboard controls</p>
          <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">Manage client hub content</h3>
          <p className="mt-3 text-slate-600">
            This editor controls the live content for <code>/client-hub</code>. Update the JSON, save it,
            and the dashboard will render the new values from Supabase.
          </p>

          <div className="mt-6 space-y-4 rounded-[1.25rem] border border-black/5 bg-slate-50 p-5 text-sm text-slate-600">
            <div>
              <p className="font-bold text-slate-950">Save target</p>
              <p className="mt-1">
                Supabase table: <code>client_hub_content</code>, row id <code>default</code>
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-950">Supported icons</p>
              <p className="mt-1">{DASHBOARD_ICON_NAMES.join(", ")}</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/client-hub" className="button-secondary">
                Open client hub
              </a>
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  const defaults = JSON.stringify(getDefaultClientHubContent(), null, 2);
                  setDraft(defaults);
                  setNotice(null);
                }}
              >
                Load defaults
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  setDraft(savedDraft);
                  setNotice(null);
                }}
              >
                Reset changes
              </button>
            </div>
          </div>

          {!configured ? (
            <div className="mt-6 rounded-[1.25rem] border border-[#8a0917]/10 bg-[#fff4f6] p-4 text-sm text-[#8a0917]">
              Supabase is not configured yet, so you can preview and edit the draft here, but saving will
              stay disabled until the env vars and SQL setup are in place.
            </div>
          ) : null}
        </section>

        <section className="card">
          <p className="eyebrow">Editing notes</p>
          <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">What to update</h3>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>Change welcome copy, cards, resources, sessions, insight text, and footer links in one save.</li>
            <li>Replace image URLs in the JSON if you want different avatars or case study visuals.</li>
            <li>Use the icon names listed on the left when updating navigation, metrics, or library items.</li>
          </ul>
        </section>
      </div>

      {notice ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[#fff4f6] text-[#8a0917]"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {loadError ? <div className="card bg-[#fff4f6] text-[#8a0917]">{loadError}</div> : null}

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">JSON editor</p>
            <h3 className="mt-3 text-2xl font-bold text-[#8a0917]">Client hub content payload</h3>
          </div>
          <button
            type="button"
            className="button-primary"
            disabled={isPending || isLoading || !configured}
            onClick={() => {
              setNotice(null);
              startTransition(async () => {
                try {
                  const parsed = JSON.parse(draft) as unknown;
                  const response = await fetch("/api/admin/client-hub", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: parsed }),
                  });
                  const payload = (await response.json()) as { content?: unknown; error?: string };

                  if (!response.ok || !payload.content) {
                    setNotice({
                      type: "error",
                      message: payload.error ?? "Unable to save the client hub content right now.",
                    });
                    return;
                  }

                  const formatted = JSON.stringify(payload.content, null, 2);
                  setDraft(formatted);
                  setSavedDraft(formatted);
                  setNotice({ type: "success", message: "Client hub content saved." });
                } catch (error) {
                  setNotice({
                    type: "error",
                    message:
                      error instanceof Error
                        ? `Invalid JSON: ${error.message}`
                        : "Invalid JSON payload.",
                  });
                }
              });
            }}
          >
            {isPending ? "Saving…" : "Save client hub"}
          </button>
        </div>

        <textarea
          className="input mt-6 min-h-[800px] resize-y font-mono text-sm leading-7"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          spellCheck={false}
        />
      </section>
    </div>
  );
}
