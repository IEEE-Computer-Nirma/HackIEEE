/* hackieee wordmark set in Dune Rise. Purely visual — the heading that
   contains it carries the accessible name. */

export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-hidden="true">
      <span className="wordmark__row">hack</span>
      <span className="wordmark__row">ieee</span>
    </span>
  );
}
