# Portfolio Website — Plan (revised)

**Owner:** Andrés Pino
**Goal:** Generate 2–4 inbound inquiries/week from small businesses, startups, and industry partners seeking advisory/review/consulting support in power electronics, electro-optical systems, undersea autonomy, and defense technology.
**Status:** Phase 1 (revised) — awaiting approval to scaffold.
**Working directory:** `C:\Users\Andres\My Drive\Documents\Claude\portfolio`

---

## Decisions confirmed in last round

| # | Decision |
|---|---|
| 1 | **Analytics:** Cloudflare Web Analytics (free, cookieless, no banner). GA4 dropped. |
| 2 | **Public copy:** OK to use generic terms (HEL, SONAR, AUV, directed energy, undersea autonomy). **DO NOT** name specific classified programs anywhere on the site. |
| 3 | **Resume PDF:** I'll produce a redacted public version stripped of home zip and any sensitive details. |
| 4 | **Headshot:** Include — pulled from LinkedIn. |
| 5 | **Images:** No assets available. I'll use clearly-marked Unsplash maritime/ocean/AUV placeholders. |
| 6 | **Projects model PIVOTED:** Projects page = curated list of **external project links** posted by his employers (Lockheed, L3Harris, Terradepth, GA-EMS), NOT his career roles. See §6 below. |
| 7 | **Domain:** `andrespino.com` |
| 8 | **"Available for engagement" status indicator:** Yes, on home. |
| 9 | **GitHub:** include link, recommend creating one if not active (see §9). |
| 10 | **Form delivery:** Formspree → andres.m.pino@gmail.com |
| 11 | **Working dir:** `C:\Users\Andres\My Drive\Documents\Claude\portfolio` ⚠ See §10 caveat about Google Drive + node_modules. |

---

## 1. Tech stack (confirmed)

| Layer | Choice |
|---|---|
| Framework | Astro 4 |
| Styling | Tailwind CSS |
| Content | Markdown content collections (`src/content/`) |
| Forms | Formspree free tier → andres.m.pino@gmail.com |
| Analytics | Cloudflare Web Analytics (no cookie banner needed) |
| Host | Cloudflare Pages |
| Domain | `andrespino.com` via Cloudflare Registrar |

**Removed from previous plan:** GA4, cookie consent banner. No cookies set by the site → no banner needed.

---

## 2. File / folder structure

```
portfolio/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .gitignore
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── robots.txt
│   ├── andres-pino-resume.pdf      # REDACTED public version
│   └── images/
│       ├── headshot.jpg            # from LinkedIn
│       ├── projects/               # Unsplash placeholders (clearly marked)
│       └── logo/                   # generated wordmark + monogram
├── src/
│   ├── components/
│   │   ├── nav/SideNav.astro
│   │   ├── nav/MobileNav.astro
│   │   ├── hero/Hero.astro
│   │   ├── hero/AvailabilityBadge.astro    # "Available for engagement"
│   │   ├── about/About.astro
│   │   ├── experience/ExperienceList.astro
│   │   ├── experience/RoleCard.astro
│   │   ├── projects/ProjectCard.astro      # external-link card
│   │   ├── projects/ProjectGrid.astro
│   │   ├── contact/ContactForm.astro
│   │   ├── ui/SectionHeading.astro
│   │   ├── ui/Tag.astro
│   │   ├── ui/ExternalLink.astro
│   │   ├── ui/Button.astro
│   │   └── seo/SEOHead.astro
│   ├── content/
│   │   ├── config.ts
│   │   ├── projects/               # one .md per external project link
│   │   └── experience/             # one .md per career role
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects/index.astro
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   └── sitemap-index.xml.ts
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       └── seo.ts
└── plan.md
```

> **Removed** `projects/[slug].astro` — since projects are external links, no internal detail pages are needed. Each project card opens the external partner page in a new tab.

---

## 3. Page-by-page section blueprint

### 3.1 Home (`/`) — single-page scroll, brittanychiang two-column model

| # | Section | Content |
|---|---|---|
| 1 | **Hero / Intro** *(left col, sticky on desktop)* | Name, role tagline, **"Available for engagement"** status pill, 2-sentence positioning, social links (LinkedIn, GitHub, email, resume PDF), section nav (About / Experience / Projects / Contact). |
| 2 | **About** *(right col)* | 3-paragraph narrative about expertise & what kind of engagements you're open to. **I will draft, mark every line.** |
| 3 | **Experience** | Vertical list — year-range, role, organization, 2–3 generic bullets per role. **No classified program names.** "View Full Resume" → redacted PDF. |
| 4 | **Selected Projects** | 3–4 featured external-project links (employer-published case studies / product pages). "All Projects →" → `/projects`. |
| 5 | **Contact** | Pitch + Formspree contact form. |
| 6 | **Footer** | © year, built with Astro, sitemap link. |

### 3.2 Projects (`/projects`)

Grid of all curated external-project links. Each card: thumbnail (Unsplash placeholder), project title, your role, 1-line context **you wrote**, source domain (e.g. "lockheedmartin.com"), tag chips, "Visit project page →" external link. Optional filter chips by domain (Power Electronics / Electro-Optical / Undersea Autonomy / SONAR).

### 3.3 Contact (`/contact`)

Standalone. Same form as home + alternate contact methods (email, LinkedIn).

### 3.4 404

Brand-aligned, single CTA back to home.

---

## 4. Component list (~14)

Layout: BaseLayout, SideNav, MobileNav, Footer
Sections: Hero, AvailabilityBadge, About, ExperienceList, RoleCard, ProjectGrid, ProjectCard, ContactForm
UI: SectionHeading, Tag, ExternalLink, Button
Infra: SEOHead

---

## 5. Design system

**Palette (CSS custom properties):**
```
--navy-black:  #0a1018
--deep-navy:   #0f1a2b
--teal:        #38e8c6
--slate:       #8aa0b4
--light-slate: #cbd5e1
--near-white:  #f1f5f9
```

**Typography (self-hosted):** Inter (UI/body/headings), JetBrains Mono (year ranges, tags, section markers like "01.").

**Motion:** subtle fade-in on scroll; respects `prefers-reduced-motion`. No carousels, no animated counters, no parallax.

**Logo (to generate):** wordmark + "AP" monogram, both flat SVG.

---

## 6. Projects model — REVISED

**Each project entry is a markdown file pointing to an external URL.** Schema:

```yaml
---
title: "Marlin Mk2 AUV"
organization: "Lockheed Martin"
role: "Lead Electrical Engineer"
year: "2010–2014"
domain: "Undersea Autonomy"
externalUrl: "https://www.lockheedmartin.com/.../marlin-mk2.html"
thumbnail: "/images/projects/marlin-placeholder.jpg"
tags: ["AUV", "Sonar", "Power Distribution"]
---

One short paragraph (2–3 sentences) of YOUR context — what you specifically did,
written in your voice, no classified detail.
```

### Candidate projects from your resume (you provide URLs)

I went through the resume and pulled the projects that are likely to have public employer pages. **You'll need to supply the actual URLs** (or tell me which to drop). I deliberately did NOT include items that are likely classified-only.

| # | Project | Org | Likely URL source | Status |
|---|---|---|---|---|
| P1 | Airborne directed-energy weapon system | General Atomics EMS | ga-asi.com / ga.com EO/IR & directed energy pages | URL needed |
| P2 | Ground-based / shipboard HEL programs | General Atomics EMS | ga.com EMS directed energy page | URL needed |
| P3 | Navy sonar transducer programs | L3Harris | l3harris.com sonar / undersea page | URL needed |
| P4 | Towed-array systems | L3Harris | l3harris.com towed-array page | URL needed |
| P5 | Dipping sonar | L3Harris | l3harris.com dipping-sonar page | URL needed |
| P6 | Terradepth long-endurance AUV | Terradepth | terradepth.com vehicles | URL needed |
| P7 | Marlin Mk2 AUV | Lockheed Martin | lockheedmartin.com Marlin page | URL needed |
| P8 | Layered Laser Defense (LLD) | Lockheed Martin | lockheedmartin.com LLD press releases | URL needed |
| P9 | Littoral Combat Ship machinery control | Lockheed Martin | lockheedmartin.com LCS page | URL needed |

> **Action for you:** open each employer's public site, find the project page, and send me the URLs. Anything without a public URL gets dropped or replaced with a generic capability description.

---

## 7. Suggested domain — CONFIRMED

`andrespino.com` — register on Cloudflare Registrar (~$45–55/yr for `.engineering` TLD; verify current price). Cheaper fallback if you want it: `andrespino.dev` (~$10/yr).

---

## 8. Resume redaction plan

I'll produce `andres-pino-resume-public.pdf` from your existing PDF with:

- ❌ Home zip code → city/state only ("San Diego, CA")
- ❌ Specific classified program names (the ones on your resume) → replaced with capability-level descriptions ("Navy sonar transducer programs", "ballistic missile defense", "airborne directed-energy weapon system", etc.)
- ⚠ Top Secret clearance line — **see §10 Q1**
- ✅ Keep employers, dates, role titles, education, generic technical scope, dollar amounts (those are public)

I'll show you a diff before publishing.

---

## 9. GitHub recommendation

You said "not sure what I'll host on GitHub." My recommendation:

- **Create a public GitHub account** (e.g. `github.com/andrespino` or `github.com/amppino`) and host **this portfolio's source code there**. That alone signals technical fluency to engineering buyers.
- Add a pinned README on your profile with a short bio + link to `andrespino.com`.
- Optional later: any small open-source utilities you want to share (power-electronics calculators, schematic templates, AUV battery sizing scripts, etc.).

**For now:** I'll wire a GitHub icon to whatever URL you give me. If you don't have an account yet, I'll omit it for v1 and we add later.

---

## 10. ⚠ Open issues / new questions

1. **Public TS clearance mention:** Show "Active Top Secret clearance" on the public site, or omit it (some prefer to share clearance status only on the private resume sent to vetted prospects). My weak recommendation: **show it** — it's a strong credibility signal for the defense buyers you're targeting, and the bare fact is commonly listed publicly. Confirm.

2. **Project URLs:** Send me whatever URLs you have now from §6. I can scaffold without these and you fill in as you find them — Projects page will look thin until you do.

3. **Headshot file:** Save your LinkedIn profile photo and drop it at `…\portfolio\public\images\headshot.jpg` once I've scaffolded. Or send it to me now.

4. **⚠ Google Drive + node_modules — IMPORTANT:** Astro's `node_modules/` and `.astro/` cache contain hundreds of thousands of small files. Google Drive will try to sync all of them and **will either choke, slow your machine, or burn Drive storage**. Three options:
   - **(a) RECOMMENDED:** Move the project to `C:\Users\Andres\portfolio\` (outside Drive) and use Git + GitHub for backup. Drive is the wrong tool for active source code.
   - **(b)** Keep in Drive but configure Drive desktop to **exclude `node_modules` and `.astro`** from sync (Drive desktop → Preferences → Folder settings, or use `.driveignore` if you have it).
   - **(c)** Keep in Drive and accept the sync slowdown.

   **Pick one before I run `npm install`.** Currently only `plan.md` lives in Drive — easy to pivot.

5. **GitHub account:** existing handle, or plan to create one? Either's fine; tells me whether to wire the icon now or in a later pass.

6. **Availability badge wording — pick one (or propose your own):**
   - "Available for engagement"
   - "Open to advisory & consulting work"
   - "Accepting select engagements"
   - "Currently taking on new projects"

---

## 11. Trade-offs made (and rejected)

- **Cloudflare Web Analytics over GA4:** simplicity wins — no cookies, no banner, no privacy policy paragraph required, free, one-click integration with CF Pages. Rejected GA4's deeper funnels (you don't need them at this scale).
- **External-link Projects model over internal case studies:** matches your reality — your work is published by your employers, not you. Rejected internal `/projects/[slug]` detail pages — they'd require original case-study writing that risks exposing IP/sensitive detail and would be redundant with employer pages.
- **Single-page scroll Home preserved:** still the right call given the brittanychiang reference.
- **Astro + Markdown + CF Pages stack:** unchanged from prior round.

---

## 12. Phase recap

- **Phase 1 (now, revised):** Plan. **STOP for your approval on §10 questions.**
- **Phase 2:** Scaffold Astro + Tailwind, empty page shells, dev server.
- **Phase 3:** Build sections (hero → about → experience → projects → contact). Pause after each. Generate logo + redacted resume PDF.
- **Phase 4:** Mobile (375/768/1280), a11y audit, Lighthouse, content review.
- **Phase 5:** Register `andrespino.com`, deploy preview to Cloudflare Pages, send you the URL. **No production until you say "ship it."**

---

**Awaiting your answers to §10 — especially Q4 (Drive vs local) before I run `npm install`.**
