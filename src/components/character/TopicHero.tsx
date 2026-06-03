import { Mascot } from "./Mascot";
import { MetaphorScene } from "./MetaphorScene";

/**
 * The animated topic intro: Pixel presents the topic's real-world metaphor with
 * its matching animated scene. Pure CSS animation (no hooks) so it renders inside
 * the statically-generated topic page.
 */
export function TopicHero({
  templateId,
  seedText,
}: {
  templateId: string;
  seedText: string;
}) {
  return (
    <section className="tdd-fade-up flex items-center gap-4 overflow-hidden rounded-2xl border border-brand-400/20 bg-gradient-to-br from-brand-500/[0.12] to-slate-900/40 p-4 sm:gap-5 sm:p-5">
      <Mascot mood="pointing" size={84} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-300/80">
          Think of it like…
        </div>
        <p className="mt-1 text-pretty text-slate-100">{seedText}</p>
      </div>
      <MetaphorScene
        templateId={templateId}
        className="hidden h-24 w-32 shrink-0 self-stretch sm:block"
      />
    </section>
  );
}
