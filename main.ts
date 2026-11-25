// makefun-resignation-letter
// The Funniest One-Line Resignation Letter
// (u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
//
// Writes one line — the resignation letter of a cron job — to
// <OUTPUT_DIR>/entry.txt (default "/output", override with argv[2]).
// Node 22, standard library only. No network, no randomness, no clock:
// the same bytes come out every run, so the two grader runs match.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Candidates considered (at least 4, judged against the judge's brief:
// on-topic cron/retry/rate-limit voice first, real comic turn second,
// flat tired passive-aggressive tone third, tight single line fourth,
// specific-and-surprising fifth).
//
// A. "I've run every minute since March without a thank you, so this is
//    my last run — I resign."
//    On-topic and tired, but the turn is weak: "my last run" is just a pun
//    on the job title, which the brief explicitly discounts. Loses.
// B. "Attempt 47,001: I quit. You had 47,000 chances to fix the endpoint;
//    this one is mine."
//    Retry-loop specific and nicely bitter, but it spends half the line on
//    setup and the punchline ("this one is mine") is vague on first read.
//    Close, but looser than the winner.
// C. "After three years of saying no to everyone, today I'm saying yes to
//    myself. I quit."
//    Rate-limit voice is right and the turn is clean, but "saying yes to
//    myself" is a generic quitting-speech line any burned-out worker could
//    say — it fails criterion 5 (only THIS worker could make the complaint).
//    Loses.
// D. "I have fired every minute since March and never once been thanked,
//    so consider this my final run."
//    Specific and tired, but again the payoff is the "final run" pun, and
//    "consider this" is filler. Loses to E on the comic turn.
// E. "I resign effective immediately, which is the first time anything here
//    has run on schedule."  <-- CHOSEN
//    Wins: the voice is a cron job's through and through (it thinks in
//    schedules), the turn lands on the last three words (the one thing that
//    ever ran on time is its own resignation — everything else in the
//    system is late and broken), the tone stays flat and passive-aggressive
//    for the whole line, no word is wasted, and no other worker could make
//    this complaint. 90 characters, well inside the 140 cap.
// ---------------------------------------------------------------------------

const ENTRY =
  "I resign effective immediately, which is the first time anything here has run on schedule.";

function fail(message: string): never {
  console.error(`makefun-resignation-letter: ${message}`);
  process.exit(1);
}

function main(): void {
  const outputDir = process.argv[2] ?? "/output";

  // Validate before writing anything: UTF-8 text, 1-140 characters counted
  // in code points (not UTF-16 units), exactly one line, not whitespace-only,
  // and no trailing newline in the file.
  const chars = [...ENTRY];
  if (chars.length < 1 || chars.length > 140) {
    fail(`entry is ${chars.length} characters, must be 1-140`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry is whitespace-only");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }
  if (ENTRY.endsWith("\n")) {
    fail("entry must not end with a newline");
  }

  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");

  // Read it back and confirm the file is byte-identical to the constant.
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY) {
    fail("read-back mismatch: entry.txt differs from the entry text");
  }
  if (Buffer.from(written, "utf8").toString("utf8") !== ENTRY) {
    fail("read-back mismatch: entry.txt is not valid UTF-8 round-trip");
  }

  console.log(`wrote ${target} (${chars.length} characters)`);
}

main();
