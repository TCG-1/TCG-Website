"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

const TRAINING_REALTIME_TABLES = [
  "admin_account_roles",
  "client_accounts",
  "client_account_roles",
  "role_definitions",
  "training_programmes",
  "training_programme_modules",
  "training_module_outcomes",
  "training_cohorts",
  "training_cohort_trainers",
  "training_cohort_memberships",
  "training_assessment_submission_events",
  "training_sessions",
  "training_session_prework_items",
  "training_session_prework_status",
  "training_session_attendance",
  "training_assessments",
  "training_assessment_submissions",
  "training_certificates",
  "training_resources",
  "training_progress_snapshots",
  "training_reminder_log",
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
