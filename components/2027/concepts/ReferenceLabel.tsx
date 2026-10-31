/**
 * Visible label on every image or artwork in the creative concepts. The
 * concepts are internal design exploration: nothing in them may read as an
 * approved HEBS 2027 or NJS Royale Beach Resort photograph.
 */
export default function ReferenceLabel({
  kind,
  className = "",
}: {
  kind: "hebs-archive" | "illustration";
  className?: string;
}) {
  const text =
    kind === "hebs-archive"
      ? "Concept reference · HEBS archive photograph (US edition) · not 2027 · not approved for publication"
      : "Concept artwork · illustration, not a photograph of NJS Royale Beach Resort";
  return (
    <span
      className={`pointer-events-none inline-block max-w-[calc(100%-1rem)] bg-black/70 px-2 py-1 text-[10px] leading-snug tracking-wide text-white ${className}`}
    >
      {text}
    </span>
  );
}
