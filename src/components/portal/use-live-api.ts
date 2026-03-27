"use client";

import { useEffect, useEffectEvent, useState } from "react";

type LiveApiOptions = {
  pollMs?: number;
};

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload as T;
}

export function useLiveApi<T>(endpoint: string, initialData: T, options?: LiveApiOptions) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useEffectEvent(async () => {
    try {
      const payload = await requestJson<T>(endpoint, {
        cache: "no-store",
      });
      setData(payload);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load data.");
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    void load();

    const intervalId = window.setInterval(() => {
      void load();
    }, options?.pollMs ?? 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endpoint, load, options?.pollMs]);

  return {
    data,
    error,
    isLoading,
    refresh: load,
    setData,
  };
}
