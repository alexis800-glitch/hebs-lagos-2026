/**
 * Visible label on every illustration in the creative concepts. The concepts
 * are internal design exploration: nothing in them may read as an approved
 * HEBS 2027 or NJS Royale Beach Resort photograph. HEBS archive photographs
 * from the US editions are not used in any 2027 design (owner, 2026-11-01).
 */
export default function ReferenceLabel({ className = "" }: { kind?: "illustration"; className?: string }) {
  return (
    <span
      className={`pointer-events-none inline-block max-w-[calc(100%-1rem)] bg-black/70 px-2 py-1 text-[10px] leading-snug tracking-wide text-white ${className}`}
    >
      Concept artwork · illustration, not a photograph of NJS Royale Beach Resort
    </span>
  );
}
