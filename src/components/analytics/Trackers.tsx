"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Fires once per session (mount) and on tab-hide. Mounted app-wide in Providers. */
export function SessionTracker() {
  useEffect(() => {
    track("session_start");
    const onVisibility = () => {
      if (document.visibilityState === "hidden") track("session_end");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  return null;
}

/** Records a topic view. Rendered on each topic page. */
export function TopicViewTracker({ topicId, phaseId }: { topicId: string; phaseId: string }) {
  useEffect(() => {
    track("topic_viewed", { topicId, phaseId });
  }, [topicId, phaseId]);
  return null;
}
