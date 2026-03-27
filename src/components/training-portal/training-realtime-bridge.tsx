"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

const TRAINING_REALTIME_TABLES = [
  "training_cohorts",
  "training_cohort_memberships",
  "training_sessions",
  "training_session_prework_items",
  "training_session_prework_status",
  "training_session_attendance",
  "training_assessments",
  "training_assessment_submissions",
  "training_resources",
  "training_progress_snapshots",
] as const;

export function TrainingRealtimeBridge({ scope }: { scope: "admin" | "client" }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`training-${scope}-refresh`);

    for (const table of TRAINING_REALTIME_TABLES) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
        },
        () => {
          router.refresh();
        },
      );
    }

    void channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router, scope]);

  return null;
}
