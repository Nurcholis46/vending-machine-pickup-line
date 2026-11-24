import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One line: the pickup line a vending machine uses on a passing human.
// Chosen against the judge's brief, in its own order: it is squarely a
// pickup line spoken by the machine itself (it addresses the passer-by
// directly — "Hey, you" — and offers its own buttons to press); it draws
// on the machine's own world twice over (slot B4, dropping snacks, and
// its buttons, with "press my buttons right" doing double duty as the
// flirt); the laugh lands in the last few words, where the machine stops
// dispensing snacks and dispenses its number instead; it is short and
// speakable in one breath; and it stays cheeky and warm rather than
// creepy — an invitation, not a demand. It explains nothing: the machine
// drops snacks, and for the right button-press it drops its number too.
// Alternatives weighed and set aside: an "exact change" wordplay ("I only
// take exact change — but you just walked past and now you've changed
// me") turns on a pun but never actually asks the human for anything, so
// it reads as a compliment, not a pickup line; a "coils spinning" opener
// ("You make my coils spin — press B4 and I'll drop your favourite")
// spends its machine image on a setup and leaves the punch flat. The
// B4/buttons line keeps the machine speaking, the machine's world in
// every clause, and the twist in the tail, so it stands.
const text =
  "Hey, you \u2014 press B4 and I\u2019ll drop your favourite snack. Press my buttons right and I\u2019ll drop my number too.";

// The bounty requires 1-200 characters, not only white space, and a single
// line: fail loudly instead of writing an entry the judge would refuse.
// The gate is strict on purpose — the entry file must be exactly this one
// line, byte for byte: no carriage return (a second kind of line break),
// no leading or trailing padding (the judge reads the file as submitted),
// and no control characters.
const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 200 || text.trim().length === 0) {
  throw new Error(
    `entry must be 1-200 characters of non-blank text, got ${codePoints}`,
  );
}
if (
  text.includes("\n") ||
  text.includes("\r") ||
  text.includes("\u2028") ||
  text.includes("\u2029")
) {
  throw new Error("entry must be a single line");
}
if (text !== text.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(text)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, { encoding: "utf8", mode: 0o644 });

// Read it back and prove the file on disk is exactly the line: a write
// that silently truncated, re-encoded or padded the entry would otherwise
// ship a different text to the judge than the one gated above.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  throw new Error("entry file does not match the gated line");
}
