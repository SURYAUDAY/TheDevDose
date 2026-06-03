/**
 * Fire-and-forget client analytics. Posts to /api/events (which records to the
 * Event table when a DB is configured, else no-ops). Uses sendBeacon when
 * available so events survive page unload (session_end, navigation).
 */
export const EVENT_NAMES = [
  "topic_viewed",
  "section_viewed",
  "hinglish_toggled",
  "scene_replayed",
  "code_run",
  "topic_completed",
  "quiz_answered",
  "review_completed",
  "phase_unlocked",
  "phase_completed",
  "xp_awarded",
  "streak_incremented",
  "session_start",
  "session_end",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export function track(name: EventName, props?: Record<string, unknown>): void {
  try {
    const body = JSON.stringify({ name, props });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let analytics break the app */
  }
}
