/**
 * HackIEEE Dune Rise Wordmark Vector Outlines
 * Derived from font units (Dune Rise by Fontswan, SIL OFL 1.1)
 */

interface Glyph {
  s: { o: string }[];
  b: [number, number, number, number];
}

const GLYPHS: Record<string, Glyph> = {
  H: {
    s: [{ o: "M167.15 433.57L167.15 800L100 800L100 0L167.15 0L167.15 366.43L832.85 366.43L832.85 0L900 0L900 800L832.85 800L832.85 433.57L167.15 433.57Z" }],
    b: [100.0, 0.0, 900.0, 800.0],
  },
  A: {
    s: [{ o: "M181.699 0L549.64 654.7L917 0L999 0L550 800L100 0L181.699 0Z" }],
    b: [100, 0, 999.0, 800.0],
  },
  C: {
    s: [{ o: "M500 0L900 0L900 67.1504L500 67.1504C316.46 67.1504 167.15 216.46 167.15 400C167.15 583.54 316.46 732.85 500 732.85L900 732.85L900 800L500 800C279.09 800 100 620.91 100 400C100 179.09 279.09 0 500 0Z" }],
    b: [100, 0.0, 900.0, 800.0],
  },
  K: {
    s: [{ o: "M167.14 271.1L167.14 800L100 800L100 0L167.14 0L167.14 183.36L372.521 356.13L795.86 0L900.16 0L424.67 400L900.16 800L795.86 800L167.14 271.1Z" }],
    b: [100.0, 0.0, 900.16, 800],
  },
  i: {
    s: [{ o: "M301.22 800L99.7803 800L99.7803 732.85L166.93 732.85L166.93 67.1504L99.7803 67.1504L99.7803 0L301.22 0L301.22 67.1504L234.07 67.1504L234.07 732.85L301.22 732.85L301.22 800Z" }],
    b: [99.78, 0.0, 301.22, 800.0],
  },
  e: {
    s: [{ o: "M500 0L900 0L900 67.1504L500 67.1504C327.79 67.1504 185.714 198.596 168.83 366.43L900 366.43L900 433.57L168.83 433.57C185.714 601.404 327.79 732.85 500 732.85L900 732.85L900 800L500 800C279.09 800 100 620.91 100 400C100 179.09 279.09 0 500 0Z" }],
    b: [100, 0.0, 900.0, 800.0],
  },
};

const WORD = ["H", "A", "C", "K", "i", "e", "e", "e"];
const ORIGINS = [0, 1492, 2956, 4440, 5946, 6841, 8336, 9832];

/**
 * Returns an inline SVG of HackIEEE in authentic Dune Rise letterforms.
 * Uses the warm sand color (#f8cf96) matching the website branding.
 */
export function getDuneRiseWordmarkSvg(width = 280): string {
  const height = Math.round((width * 800) / 10800);
  const letterPaths = WORD.map((ch, i) => {
    const glyph = GLYPHS[ch];
    if (!glyph) return "";
    return `<path d="${glyph.s[0].o}" transform="translate(${ORIGINS[i]}, 800) scale(1, -1)" fill="#f8cf96" />`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10800 800" width="${width}" height="${height}" style="display: block; margin: 0 auto; max-width: 100%; height: auto;" role="img" aria-label="HackIEEE">
  ${letterPaths}
</svg>`;
}
