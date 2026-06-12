# Session Handoff — andrespino.com portfolio

**Last updated:** 2026-05-29 session end · **Branch:** `main` @ `61efdec` (pushed) **+ 7 files of UNCOMMITTED design-enhancement work** (see §2d). Read §2d first.

---

## 1. What this project is

Personal portfolio for **Andrés Pino** — senior defense/maritime engineering advisor, San Diego, active TS clearance. Goal: **2–4 inbound advisory/consulting inquiries per week** from defense/maritime buyers (high-energy laser, sonar, AUV/UUV, power electronics). The site has a deliberate **subsea focus**.

**Live:** https://andrespino.com
**Stack:** Astro + Tailwind v4, Markdown content collections, self-hosted fonts (@fontsource), Formspree contact form (endpoint `xjgjzrjz` → andres.m.pino@gmail.com), Cloudflare Web Analytics (cookieless).
**Hosting:** Cloudflare Pages, auto-deploys from GitHub `apino01/Portfolio-Website` on push to `main` (~1–2 min).
**Working dir:** `C:\Users\Andres\My Drive\Documents\Claude\portfolio` (Google Drive synced — node_modules/.astro/dist excluded from sync; `graphify-out/` is gitignored).
**Dev server:** `npm run dev` → http://localhost:4321 (dies between sessions — restart as needed).

---

## 2. Layout / architecture

- **Two-column sticky layout:** left hero sidebar (name, headshot, bio, trust line, clearance, sonar-return trace, CTA, side-nav, résumé/LinkedIn) + right scrolling content (About → Experience → Selected Projects → Contact).
- **Content collections:** `src/content/experience/*.md` (5 employers) and `src/content/projects/*.md` (12 project files). `featured: true` = shown on homepage; `/projects` page shows ALL by `order`.
- **Domain pages:** `/sonar`, `/auv-uuv`, `/directed-energy` filter projects by tag/domain. `/projects` = full catalog. Plus `/` and `/404`.
- **Ambient subsea scene** (`src/components/scene/`): BackgroundScene (Navy fleet SVGs + HELRAS helicopter), CausticLight, MarineSnow, WaterSurface, DepthGauge, SonarReturn. Layered behind content via z-index; deferred until after LCP.

---

## 2b. Surface-scene + mobile session (2026-05-27, commits `be9667d`→`1ab3d04`)

Focused on the ambient surface scene (helicopter dipping sonar) and mobile polish.

| Commit | What |
|---|---|
| `be9667d` | **Surface scene rework.** Wrapped waterline + destroyer + helicopter in one `.surface-deck` shared coordinate frame so hull/surface/transducer stay aligned at any viewport (fixes the mobile dip stopping above the waterline). Lifted helo into the sky band ("stacked bands" layout), lengthened the tether for a deep dip. Added **active HELRAS pinging**: downward acoustic wavefronts that emanate from the projector toward the seabed + return echoes, gated to the deployed-and-active window. Added **beam steering** to the torpedo/forward-sonar swath (sweeps ±16° at the nose, shared by both torpedoes + bottom-UUV forward beam). |
| `28988e5` | **Mobile optimization.** Tap targets → 44px (nav pills, résumé link, IconLink). Marine snow halved on phones (≤640px, `display:none` on `:nth-child(n+15)`). Dropped `background-attachment:fixed` on phones (iOS scroll-jank). Desktop unchanged (32 particles, fixed attachment). |
| `fc97e0b` | Removed the 8 articulating radial arms from the transducer (markup + `arm-deploy` keyframes + reduced-motion). Cylinder body + waves unchanged. |
| `ee23763` | **Mobile-only:** dip 25% deeper + ship/water-surface at the tether midpoint. Parametrized tether length with `--dip`/`--cable-scale` CSS vars (default 300px; mobile 375px). NB: mobile override must sit **after** the base `--dip` rule (equal-specificity media query → source order wins). |
| `1ab3d04` | **Wave layering fix.** Acoustic wavefronts were trapped behind content by the scene's `opacity:0.55` stacking context → hidden behind the About section on mobile. Moved them into a sibling `.helras-wave-layer` (`z-index:11`, above `main`) that mirrors the helo/deck geometry and statically drops to the deployed transducer depth (`translateY(--dip)`). `pointer-events:none` + `mix-blend-mode:screen` → teal glows over the dark bg without harming light text. Still gated to the ping window. |

**Scene mechanics worth knowing for future edits:**
- All sonar wave/beam animations (`bg-ping-out`, `bg-echo-in`, `bg-helo-cone`, `bg-torp-sonar` beam-steer) are **shared CSS** — desktop and mobile render identically. The *only* desktop/mobile differences are: `--dip` (300 vs 375), water-surface position, snow count, bg-attachment, tap targets.
- The dipping-sonar transducer now has **no articulating arms** (just the cylinder body + hydrophone plates).
- `.helras-wave-layer` is a **duplicate of the wave group** rendered above content; the in-scene rig still carries the transducer body/tether (below content). They stay in sync via the shared 90s gate + matching `--dip`.
- Helicopter cycle comment (top of `BackgroundScene.astro`) documents the 90s choreography.
- **Open/possible follow-ups:** AUV (bottom-UUV) *downward* seabed beam still only pulses (no beam-steering) — Andrés declined adding it this session. Animation-load review flagged ~80 concurrent animated nodes; snow reduction on mobile was the main mitigation taken.

## 2c. Content edits (2026-05-12, commits `d6d1195`, `61efdec` — PUSHED/LIVE)

Small copy/link fixes after the surface-scene session, both pushed to prod:
- `d6d1195` — Marlin AUV `externalUrl` → `https://oceannews.com/featured-stories/april-feature-story-lockheed-martin-corporation/` (in `src/content/projects/04-marlin-auv.md`). Hero intro reworded to "guiding teams through the full development lifecycle…".
- `61efdec` — Hero intro: "maritime and defense **hardware**" → "**systems**".
- About section's own "20 years" line is *different* copy (pairing judgment with modern tooling) — intentionally NOT synced to the hero. Leave it.

## 2d. Design-enhancement session (2026-05-29) — ⚠️ UNCOMMITTED, on localhost only

Ran a 3-framework design audit (`emil-design-eng` + `design-taste-frontend` + `impeccable`) of the live site, then prototyped 8 theme-aligned engagement enhancements. **All 7 modified files are UNCOMMITTED** in the working tree. Verified at desktop 1440px AND mobile 390px, 0 console errors, every animation has a `prefers-reduced-motion` fallback. NOT yet reviewed/approved by Andrés, NOT pushed.

**Audit verdict:** site is NOT AI-slop (committed navy+teal palette, Chakra Petch display, bespoke subsea scene clear both category-reflex tiers). Nielsen ~27/36 (n/a Help excluded), "Good". The one real AI-tell found was the decorative "ACOUSTIC RETURN · 4.3 KHZ" hero strip → fixed (#1 below).

**The 8 changes (file → what):**
1. **`Hero.astro`** — killed the decorative "ACOUSTIC RETURN" strip; replaced with rotating **"Currently active on: {engagement}"** live signal. Edit the `currentlyActive` array when commitments change; rotates client-side, 6s dwell + ~320ms crossfade, `aria-live="polite"`. Current 3 entries: `"Gen 3 High Energy Laser · GA-EMS"`, `"Long-Endurance AUV · Terradepth"`, `"MK54 SONAR · L3Harris"` — ⚠️ confirm with Andrés these are accurate to claim publicly before pushing.
2. **`global.css`** — global button **`:active` press feedback** (`scale(0.97)`, 140ms) on `a, button, [role=button], summary`. Emil's first-order detail.
3. **`ProjectCard.astro`** — **sonar-return reveal**: on view-enter the accent bar pings + an expanding arc (`.card-ping`) sweeps across; card resolves behind it. Replaces the old plain fade-up.
4. **`ProjectCard.astro`** — **hover lock-on**: reticle corners scale-in from their own corner, `.card-scan` hairline sweeps top→bottom, accent bar glows. Reads "target acquired."
5. **`SideNav.astro`** — **depth ladder**: each nav item shows a depth marker (About=Surface, Experience=2000 m, Projects=4000 m, Contact=6000 m); active item's rule + depth → teal via the existing IntersectionObserver scroll-spy. Desktop only (`hidden lg:block`).
6. **`SectionHeading.astro` + `global.css`** — **bathymetric line-draw**: 3 layered contour `[data-bathy-path]` SVGs draw themselves (stroke-dashoffset 1200→0, staggered 900/1100/1300ms) when the heading's `.is-visible` toggles on view-enter. Desktop contour; mobile shows inline depth tag.
7. **`DepthGauge.astro`** — **live numeric depth readout** riding the marker (e.g. "3,560 M"), interpolated from scroll progress (`--depth-p` × 6000, rounded to nearest 10 m to avoid jitter). NOTE: my original audit said "counter tween" but the gauge fill was already continuous/smooth with no jumping digit — so the real win was adding a numeric readout, not a tween. Desktop only.
8. **`ContactSection.astro`** — **form submit choreography** (themed): button label morphs "Send message" → **"Pinging…"** (with a looping `.contact-submit__pulse` sonar ring) → **"Contact established"** (settle glow) on success, or **"Signal lost — email me directly"** on error. Status line copy themed to match. The underlying fetch→Formspree handler already existed; this layers theme + states on top.
- *Bonus already present from a parallel session:* headshot ambient caustic drift (`.headshot-ping::before` in `global.css`, 14s diagonal teal gradient, reduced-motion off).

**DEFERRED (flagged to Andrés, NOT built):** #10 canvas sonar-waterfall on `/sonar` (perf risk), #11 cursor depth-readout (AI-tell risk). Both need their own pass if wanted.

**Mechanics for future edits:** all the new wave/beam/reveal motion is shared CSS; reduced-motion blocks pair every animation. The card reveal + heading line-draw both ride view-enter IntersectionObservers (`is-visible` class), so they only fire when scrolled into view (do NOT gate base visibility on them — content is visible by default, motion enhances).

**Untracked tooling artifacts** (from the `impeccable` skill setup, NOT site code): `PRODUCT.md` and `.impeccable/` dir at repo root. Decide whether to commit (project context doc) or gitignore them. They do not affect the build.

**Two dev servers were left running this session:** `4321` (desktop) + `4323` (mobile, started via `npx astro dev --port 4323`). Both may be dead by next session — restart as needed. NB: Astro auto-increments the port if one is taken (saw `4322` mid-session), so confirm the actual port from the dev-server output before pointing a browser at it.

**Resume options for next chat:** (a) Andrés reviews the 8 enhancements on localhost → commit + push (one commit, triggers Cloudflare deploy); (b) iterate on any of the 8; (c) build deferred #10/#11; (d) revert all via `git checkout -- src/`.

## 3. Work accomplished (earlier session, commit-by-commit)

| Commit | What |
|---|---|
| `df34de2` | Overhauled background scene (vessel orientation, bottom UUV, mobile animations), removed Section 01–04 eyebrows, replaced 4-project set with 7-card reverse-chronological lineup |
| `be1bf8a` | **SEO:** added Person + WebSite + Service JSON-LD; tuned all 5 page titles/descriptions to buyer-intent keywords; OG image dims/alt |
| `183ebb5` | **SEO:** changed schema `ProfessionalService` → `Service` (validator-clean) |
| `709a171` | Maritime prototype: depth-descent metaphor, ambient layers, bathymetric section dividers, depth gauge groundwork |
| `f7061f9` | **Perf:** self-hosted Inter + JetBrains Mono (dropped Google Fonts), preload hero AVIF, defer scene paint until after LCP |
| `c8d12f8` | **Mobile:** depth markers visible on phones, footer chart labels moved to responsive HTML |
| `9ca7d03` / `f6b9bde` | Depth-tag tuning: footer 5500–6000 m; About=Surface, Contact=5000–6000 m (linear descent metaphor) |
| `51cfa53` | Added **LWWAA** + **Textured Ceramic R&D** projects; refreshed links/copy for Gen3 HEL, MQ-9B, MK54, Terradepth; **RAPVLA** delinked name + new source; project-card UI polish (reticle corners, accent bars, scroll-reveal); domain pages "Programs delivered"→"Program experience" |
| `94e805a` | Curated homepage to **6 subsea-led projects**; deleted 2 redundant composite cards (05-undersea-warfare, 09-lm-directed-energy) |
| `cd92296` | **SEO:** canonical trailing-slash internal links + homepage→domain contextual links |
| `e474c9a` | **Design polish:** depth gauge, hero entrance stagger, headshot ping, active-nav teal, Chakra Petch display font, grain overlay, helicopter fast-deploy; technical-domains 2-row split; Terradepth line-break; degree + acoustics; removed inline prose links |
| `39b44f1` | Fixed helicopter not fully exiting (vw units instead of element-% so it clears the viewport) |

---

## 4. Current homepage "Selected Projects" (6, in order)

1. Gen 3 High Energy Laser (GA-EMS)
2. MK54 Planar SONAR Array (L3Harris)
3. LWWAA — Lightweight Wide Aperture Array (L3Harris)
4. Long-Endurance AUV w/ Autonomous Recharging (Terradepth)
5. RAPVLA — Rapidly Deployable Passive Vertical Line Array (Lockheed Martin)
6. Marlin AUV (Lockheed Martin)

**On `/projects` only (featured: false):** MQ-9B Laser Pod, HELRAS, HELIOS, LLD, TB-class Towed Array, Textured Ceramic R&D.
**Deleted:** 05-l3-undersea-warfare, 09-lm-directed-energy (redundant composites).

---

## 5. Current design enhancements LIVE (from the polish pass)

- **Depth gauge** — scroll-linked right rail (SURFACE → 6000 M), desktop only
- **Hero entrance** — staggered fade-up on load
- **Headshot ping** — one-shot sonar ring on load
- **Active side-nav** — teal accent (was near-white)
- **Chakra Petch** display font — name + section headings (H1/H2) only; body = Inter, mono = JetBrains
- **Grain overlay** — 4% noise texture over dark field
- **Helicopter HELRAS** — fast deploy (~21s), full exit, quiet interval, repeat

---

## 6. What Andrés DIDN'T like / had me change or remove

- **"Programs delivered"** framing — he supported, didn't solely deliver. Changed domain-page header to **"Program experience"**. (Hero "Programs delivered for:" line kept — it names orgs, reads fine.)
- **Heavy green water-surface line** — initial version too bright/distracting → made the surface transition much more subtle (soft tonal band + whisper ripple).
- **Hero lat/long coordinates** — added then removed (too cute).
- **Marine snow particles** near the surface — moved spawn to mid-viewport (only appear "at depth").
- **Animated link underlines (E)** — built, then he had me remove them entirely; then removed the inline prose links altogether (kept the "Explore by domain" row for SEO).
- **Experience card hover highlight** — removed.
- **Tag contrast** — "colors too similar" → added subtle border + softer fill + hover lift.
- **Helicopter too slow to deploy** — sped up; then "flies away and stops" → fixed with vw units.

---

## 7. Open verdicts / things he may still want to judge

- **Chakra Petch headings** — biggest visual shift; he committed it but should eyeball on production. Fallbacks if too "techy": apply to name only, swap face, or revert to Inter.
- **Grain overlay** at 4% — subtle; can dial to 6–7% or remove.
- He tends to **prototype → review on localhost → commit when happy**. Don't push to prod without an explicit "commit"/"ship it" (though this session he often said commit directly).

---

## 8. SEO status (Google Search Console + Cloudflare)

**The bottleneck is INDEXING, not content or speed.** As of last data pull:
- **Only ~1 of 8 pages indexed.** 4 domain/content pages were "Discovered – currently not indexed" (low domain authority — new site). 3 "Page with redirect" (benign canonical variants).
- Requested indexing on `/`, `/sonar`, `/auv-uuv`, `/directed-energy`, `/projects`; shipped internal links (commit `cd92296`) to help crawl.
- **Search Console (28d, name-filtered):** ~67 impressions, 1 click, avg position ~8.1, only name queries ("andres pino"). No service queries yet — expected until domain pages index.
- **Core Web Vitals:** CLS 100% good; LCP P50 ~1,488ms (healthy); P75/P90 skewed by single-visit outliers (ignore until 7-day sample). Performance fixes are working — do NOT chase the red CWV slivers.

**Phase-2 SEO recommendation (deferred until pages index, ~2–3 weeks):** internal-linking already done (Option F); hold long-form case studies (D) and blog (E) until coverage climbs. Backlinks (LinkedIn/GitHub/directories) are the real accelerant for indexing.

**A one-time remote agent is scheduled** (routine `trig_01Awu32o2JdGcbVyZw4ikjhF`, https://claude.ai/code/routines/trig_01Awu32o2JdGcbVyZw4ikjhF) to do a Phase-2 SEO review — it auto-disabled after a GitHub auth lapse but was manually re-run once GitHub was reauthorized. It needs analytics screenshots pasted to it.

---

## 9. Outstanding / never-done items

- **SM-3 Block IIA, BMD VLS, MPCMS for LCS** — on résumé, intentionally OMITTED (not subsea; may add later if expanding into "big-system maritime").
- **Per-project `role` lines** — Andrés wants to refine these later (edit frontmatter `role:` in each project .md).
- **Redacted résumé PDF** at `/andres-pino-resume.pdf` — verify it's current/redacted (strip home zip).
- **og-image.png** (1200×630) in public/ — confirm present.

---

## 10. Tooling / process notes

- **Hero "How I work" block** advertises daily AI tooling: Claude Code, Cowork, Claude, ChatGPT Codex.
- **graphify** was run on `src/` → outputs in `graphify-out/` (gitignored). Found a notable echo: `BathymetryFooter` and `SectionHeading` both reimplement the bathymetric-contour SVG. **Verdict: do NOT extract a shared component** — it's incidental (thematic) duplication, not true duplication; they have opposite opacity gradients, different scale/role, and no shared reason to change. Leaving separate is correct.
- **Reusable kickoff prompt** for Andrés's brother's coaching/interview-prep site was generated (bakes in the wins, engineers out this project's time-wasters: self-host fonts from day 1, use Service schema, mobile-first, minimal animation budget, gather real content before building). Not saved to a file — re-generate if needed.
- **Generic shareable kickoff prompt** (2026-05-29) — a phased "build a senior-professional advisory portfolio" prompt Andrés can hand to anyone. 6 phases (Discovery→Direction→Structure→Build→signature theme element→SEO/launch) + anti-slop rules. Output to chat only, NOT saved to a file. Re-generate on request; offer to save as `.md` in repo if he wants it kept.
- **3-framework design audit** (`emil-design-eng`, `design-taste-frontend`, `impeccable`) was run this session — full verdict + Nielsen table in §2d. The `impeccable` skill wanted a `PRODUCT.md` scaffold (init flow); skipped it, used the skills as critique frameworks directly. The untracked `PRODUCT.md` / `.impeccable/` at repo root are leftovers from that (see §2d).
- **Program names are public-OK** (MK54, HELRAS, HELIOS, LWWAA, RAPVLA, etc.). NEVER characterize classification status of any program.
- **CRLF warnings** on every commit are harmless (LF→CRLF line-ending normalization).

---

## 11. How to resume

1. `cd "C:\Users\Andres\My Drive\Documents\Claude\portfolio"` · `git status` · `npm run dev`
2. ⚠️ Working tree is **NOT clean** — 7 modified files = uncommitted design enhancements (see §2d). Last pushed commit `61efdec`; branch otherwise synced to `origin/main`. Untracked: `PRODUCT.md`, `.impeccable/` (tooling, see §2d).
3. Default workflow: make changes → review on localhost:4321 → commit/push when Andrés approves (push to `main` = Cloudflare prod deploy, ~1–2 min).
4. Memory files exist: `user_andres_pino.md` (profile) and `project_portfolio_site.md` (project) — already loaded via auto-memory.
5. First action next chat: ask Andrés whether to commit/push the §2d enhancements, iterate, or revert.
