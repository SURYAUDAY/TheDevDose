/**
 * Content pipeline (M1). Parses the 17 source .md files in content-src/ into one
 * validated JSON per topic under content/<phaseId>/<NNN>-<slug>.json, plus a
 * content/_manifest.json. Re-run any time the source content changes.
 *
 *   npm run content:parse
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { parseFile, type ParsedTopic } from "./lib/parse.js";
import { phaseFromFilename, PHASES, type PhaseDef } from "./lib/phases.js";
import { deriveMetadata } from "./lib/metadata.js";
import { TopicSchema, ManifestSchema, type Topic } from "./lib/schema.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(ROOT, "content-src");
const OUT_DIR = join(ROOT, "content");

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\+\+/g, "-plus-plus")
    .replace(/#/g, "-sharp")
    .replace(/[._/&]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function main() {
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".docx.md"));
  if (files.length === 0) {
    throw new Error(`No .docx.md files found in ${SRC_DIR}`);
  }

  // Group parsed topics by phase.
  const byPhase = new Map<string, { phase: PhaseDef; topics: ParsedTopic[]; intro: string }>();
  for (const file of files) {
    const phase = phaseFromFilename(file);
    if (!phase) {
      throw new Error(`Cannot resolve a phase for file: ${file}`);
    }
    const raw = readFileSync(join(SRC_DIR, file), "utf8");
    const { intro, topics } = parseFile(raw, phase, file);
    for (const t of topics) (t as ParsedTopic & { __file: string }).__file = file;
    const bucket = byPhase.get(phase.id) ?? { phase, topics: [], intro };
    if (!bucket.intro && intro) bucket.intro = intro;
    bucket.topics.push(...topics);
    byPhase.set(phase.id, bucket);
  }

  // Clean output dir (content/ is fully generated and committed).
  if (existsSync(OUT_DIR)) {
    for (const phase of Object.values(PHASES)) {
      const dir = join(OUT_DIR, phase.id);
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const manifestPhases = [];
  let total = 0;

  for (const phase of Object.values(PHASES).sort((a, b) => a.order - b.order)) {
    const bucket = byPhase.get(phase.id);
    if (!bucket) {
      throw new Error(`No source files produced topics for phase ${phase.code}`);
    }
    // Dense ordering by source number hides gaps (e.g. JS 26-50).
    const sorted = bucket.topics.slice().sort((a, b) => a.number - b.number);
    const phaseDir = join(OUT_DIR, phase.id);
    mkdirSync(phaseDir, { recursive: true });

    const usedSlugs = new Set<string>();
    sorted.forEach((parsed, i) => {
      const orderInPhase = i + 1;
      const orderRatio = orderInPhase / sorted.length;
      const meta = deriveMetadata(parsed, phase, orderRatio);

      let slug = slugify(parsed.title);
      if (!slug) slug = `topic-${pad3(parsed.number)}`;
      if (usedSlugs.has(slug)) slug = `${slug}-${pad3(parsed.number)}`;
      usedSlugs.add(slug);

      const file = (parsed as ParsedTopic & { __file?: string }).__file ?? "";
      const topic: Topic = {
        id: `${phase.code.toLowerCase()}-${pad3(parsed.number)}`,
        phaseId: phase.id,
        phaseCode: phase.code,
        number: parsed.number,
        orderInPhase,
        slug,
        title: parsed.title,
        difficulty: meta.difficulty,
        tags: meta.tags,
        estMinutes: meta.estMinutes,
        metaphor: meta.metaphor,
        sections: parsed.sections,
        snippets: parsed.snippets,
        source: { file },
      };

      const parsedOk = TopicSchema.safeParse(topic);
      if (!parsedOk.success) {
        throw new Error(
          `Schema validation failed for ${topic.id} "${topic.title}":\n` +
            JSON.stringify(parsedOk.error.format(), null, 2),
        );
      }

      writeFileSync(
        join(phaseDir, `${pad3(parsed.number)}-${slug}.json`),
        JSON.stringify(topic, null, 2) + "\n",
        "utf8",
      );
    });

    total += sorted.length;
    manifestPhases.push({
      id: phase.id,
      code: phase.code,
      title: phase.title,
      order: phase.order,
      primaryLanguage: phase.primaryLanguage,
      topicCount: sorted.length,
      missingNumbers: phase.missingNumbers,
      blurb: phase.blurb,
    });

    const gap = phase.expectedTopics !== sorted.length ? "  ⚠️ COUNT MISMATCH" : "";
    console.log(
      `  ${phase.code}  ${phase.title.padEnd(22)} ${String(sorted.length).padStart(3)} topics${gap}`,
    );
  }

  const manifest = {
    generatedFrom: "content-src",
    totalTopics: total,
    phases: manifestPhases,
  };
  ManifestSchema.parse(manifest);
  writeFileSync(join(OUT_DIR, "_manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");

  // Seed an empty overrides map only if one does not already exist (never clobber edits).
  const overridesPath = join(OUT_DIR, "metadata-overrides.json");
  if (!existsSync(overridesPath)) {
    writeFileSync(
      overridesPath,
      JSON.stringify(
        {
          _doc:
            "Per-topic overrides merged on top of auto-derived metadata at seed time. Key by topic id, e.g. \"p1a-001\": { \"difficulty\": \"intermediate\", \"tags\": [...], \"metaphor\": { \"templateId\": \"kitchen\" } }",
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
  }

  console.log(`\n✅ Parsed ${total} topics across ${manifestPhases.length} phases -> content/`);
}

main();
