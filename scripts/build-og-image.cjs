// Build the Open Graph image (1200x630 PNG) for social link previews.
// Renders an SVG with the site's design language to public/og-image.png.
// Run: node scripts/build-og-image.cjs

const fs = require("fs");
const path = require("path");

// sharp is bundled with Astro's dependency tree
const sharp = require(path.join(
  process.cwd(),
  "node_modules",
  "sharp"
));

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#06192d" />
      <stop offset="50%" stop-color="#03101e" />
      <stop offset="100%" stop-color="#000509" />
    </linearGradient>
    <radialGradient id="accent" cx="20%" cy="100%" r="60%">
      <stop offset="0%" stop-color="#0f3257" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#03101e" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="caustic-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7fdbff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#7fdbff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Base -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#accent)" />

  <!-- Caustic light shimmer at top -->
  <g stroke="url(#caustic-fade)" stroke-width="1.5" fill="none" opacity="0.45">
    <path d="M 80 0 Q 120 80 60 200 T 100 360" />
    <path d="M 280 0 Q 240 100 320 220 T 280 380" />
    <path d="M 480 0 Q 520 90 440 210 T 500 360" />
    <path d="M 680 0 Q 640 110 720 230 T 680 380" />
    <path d="M 880 0 Q 920 80 840 200 T 900 360" />
    <path d="M 1080 0 Q 1040 100 1120 220 T 1080 380" />
  </g>

  <!-- Submarine silhouette mid-water (atmospheric) -->
  <g fill="#38e8c6" opacity="0.10" transform="translate(640 410)">
    <path d="M 24 55 Q 36 28 100 25 L 480 25 Q 540 28 572 55 Q 540 84 480 87 L 100 87 Q 36 84 24 55 Z" />
    <path d="M 220 25 Q 222 7 244 5 L 320 5 Q 342 7 346 25 Z" />
    <rect x="252" y="16" width="78" height="4" rx="1" />
    <path d="M 572 55 L 595 30 L 590 53 Z" />
    <path d="M 572 55 L 595 80 L 590 57 Z" />
  </g>

  <!-- Top mono label -->
  <text x="80" y="100" fill="#38e8c6" font-family="ui-monospace, 'JetBrains Mono', Consolas, monospace" font-size="22" font-weight="600" letter-spacing="6">
    ANDRESPINO.COM
  </text>

  <!-- Headline -->
  <text x="80" y="240" fill="#f1f5f9" font-family="Inter, 'Segoe UI', sans-serif" font-size="84" font-weight="700">
    Andrés Pino
  </text>

  <text x="80" y="305" fill="#cbd5e1" font-family="Inter, 'Segoe UI', sans-serif" font-size="34" font-weight="500">
    Senior Electrical &amp; Systems Engineering Leader
  </text>

  <!-- Domain pill row -->
  <text x="80" y="370" fill="#8aa0b4" font-family="ui-monospace, 'JetBrains Mono', Consolas, monospace" font-size="22" letter-spacing="2">
    Power Electronics  ·  Sonar  ·  Undersea Autonomy  ·  Directed Energy
  </text>

  <!-- Bottom credentials strip -->
  <g font-family="ui-monospace, 'JetBrains Mono', Consolas, monospace" font-size="20" letter-spacing="3">
    <rect x="80" y="510" width="180" height="36" fill="rgba(56,232,198,0.15)" stroke="#38e8c6" stroke-width="1" rx="3" />
    <text x="170" y="535" fill="#38e8c6" text-anchor="middle">CLEARANCE: TS</text>

    <rect x="276" y="510" width="240" height="36" fill="rgba(10,37,64,0.6)" stroke="rgba(138,160,180,0.5)" stroke-width="1" rx="3" />
    <text x="396" y="535" fill="#cbd5e1" text-anchor="middle">SAN DIEGO, CA</text>

    <rect x="532" y="510" width="200" height="36" fill="rgba(10,37,64,0.6)" stroke="rgba(138,160,180,0.5)" stroke-width="1" rx="3" />
    <text x="632" y="535" fill="#cbd5e1" text-anchor="middle">20 YEARS</text>
  </g>

  <!-- Right-side mono callout -->
  <text x="1120" y="565" fill="#8aa0b4" font-family="ui-monospace, 'JetBrains Mono', Consolas, monospace" font-size="16" letter-spacing="2" text-anchor="end">
    OPEN TO ADVISORY · CONSULTING
  </text>
</svg>`;

const outPath = path.join(
  process.cwd(),
  "public",
  "og-image.png"
);

sharp(Buffer.from(svg))
  .png({ quality: 92 })
  .toFile(outPath)
  .then((info) => {
    console.log(`OK ${outPath} (${info.size} bytes, ${info.width}x${info.height})`);
  })
  .catch((err) => {
    console.error("Failed to render OG image:", err);
    process.exit(1);
  });
