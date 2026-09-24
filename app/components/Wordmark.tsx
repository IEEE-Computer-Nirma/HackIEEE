/* HackIEEE wordmark set in Dune Rise. Purely visual — the heading that
   contains it carries the accessible name. */

const ROWS = ["hack", "ieee"];

export default function Wordmark({ className = "" }: { className?: string }) {
  let i = 0;
  return (
    <span className={`wordmark ${className}`} aria-hidden="true">
      {ROWS.map((word, r) => (
        <span key={word} className="wordmark__row">
          {[...word].map((ch, c) => {
            const isLast = r === ROWS.length - 1 && c === word.length - 1;
            return (
              <span
                key={c}
                className={`wm-l ${ch === "a" ? "wm-a" : ""}`}
                style={{ "--i": i++ } as React.CSSProperties}
              >
                {ch}
                {isLast && <span className="wm-flare" />}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
