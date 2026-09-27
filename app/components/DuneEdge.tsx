/* A dune ridge in the page colour, with rim light on its crest — sits on top
   of a section so the section rises out of the scene above it. */
const RIDGE = "M0 92C150 70 290 38 460 62C610 84 700 104 820 78C960 48 1060 20 1200 36C1310 48 1380 72 1440 66";

export default function DuneEdge({ id }: { id: string }) {
  return (
    <svg className="dune-edge" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffb061" stopOpacity="0.05" />
          <stop offset="0.55" stopColor="#ffb061" stopOpacity="0.55" />
          <stop offset="0.8" stopColor="#ffd9a3" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffb061" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d={`${RIDGE}V140H0Z`} fill="currentColor" />
      <path d={RIDGE} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
