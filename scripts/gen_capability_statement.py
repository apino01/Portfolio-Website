"""Generate public/andres-pino-capability-statement.pdf (one page, print-safe).

Run from the repo root:  python scripts/gen_capability_statement.py
Requires: pip install reportlab

Content is drawn only from facts already published on andrespino.com.
Registration identifiers (UEI/CAGE, business type) are set in the constants
below and their rows are omitted while empty; never invent them. Never
characterize the classification status of any program.
"""

# Fill from SAM.gov once the entity registration is active (UEI is issued at
# registration; CAGE follows DLA validation). Example business type:
# "California LLC (single-member) · Small Business".
UEI = ""
CAGE = ""
BUSINESS_TYPE = ""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepInFrame, PageTemplate, Paragraph, Spacer,
    Table, TableStyle,
)

OUT = Path(__file__).resolve().parent.parent / "public" / "andres-pino-capability-statement.pdf"

NAVY = HexColor("#0a1a2b")
INK = HexColor("#111c2b")
TEAL_DK = HexColor("#0d7a6c")
TEAL = HexColor("#38e8c6")
SLATE = HexColor("#44546a")
RULE = HexColor("#c9d3dd")

PAGE_W, PAGE_H = LETTER
MARGIN = 0.5 * inch
HEADER_H = 1.02 * inch


def p(name, size, leading, color=INK, space=0, bold=False, tracking=0):
    return ParagraphStyle(
        name, fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size, leading=leading, textColor=color,
        spaceAfter=space, alignment=TA_LEFT, charSpace=tracking,
    )


S_SECTION = p("sec", 8.4, 11, TEAL_DK, 4, bold=True, tracking=1.1)
S_BODY_SM = p("bodysm", 7.9, 10.6, SLATE, 3)
S_BULLET = p("bul", 8.2, 11.1, INK, 2.4)
S_ROLE = p("role", 8.5, 10.8, NAVY, 0, bold=True)
S_META = p("meta", 7.5, 10, SLATE, 4)
S_DATA_K = p("dk", 7.5, 10.2, SLATE, 0, bold=True, tracking=0.6)
S_DATA_V = p("dv", 8.0, 10.6, INK, 3)


def bullet(txt):
    return Paragraph(f'<font color="#0d7a6c">&#9642;</font>&nbsp;&nbsp;{txt}', S_BULLET)


def section(title):
    return Paragraph(title.upper(), S_SECTION)


def rule(w, color=TEAL, thick=1.1):
    t = Table([[""]], colWidths=[w], rowHeights=[thick])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def draw_header(canv, doc):
    canv.saveState()
    canv.setFillColor(NAVY)
    canv.rect(0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, stroke=0, fill=1)
    canv.setFillColor(TEAL)
    canv.rect(0, PAGE_H - HEADER_H, PAGE_W, 2.6, stroke=0, fill=1)

    x = MARGIN
    canv.setFillColor(white)
    canv.setFont("Helvetica-Bold", 19)
    canv.drawString(x, PAGE_H - 0.44 * inch, "ANDRÉS PINO")
    canv.setFillColor(TEAL)
    canv.setFont("Helvetica", 9.6)
    canv.drawString(x, PAGE_H - 0.63 * inch,
                    "Engineering Advisor — Undersea Vehicles & Maritime Energy Systems")
    canv.setFillColor(HexColor("#9fb3c8"))
    canv.setFont("Helvetica", 7.7)
    canv.drawString(x, PAGE_H - 0.83 * inch,
                    "CAPABILITY STATEMENT  ·  SAN DIEGO, CA  ·  ACTIVE TOP SECRET CLEARANCE")

    right = PAGE_W - MARGIN
    canv.setFillColor(white)
    canv.setFont("Helvetica", 8.2)
    canv.drawRightString(right, PAGE_H - 0.46 * inch, "andrespino.com")
    canv.setFillColor(HexColor("#cfe0ea"))
    canv.setFont("Helvetica", 7.9)
    canv.drawRightString(right, PAGE_H - 0.63 * inch, "andres.m.pino@gmail.com")
    canv.drawRightString(right, PAGE_H - 0.79 * inch, "linkedin.com/in/andresmpino")

    canv.setStrokeColor(RULE)
    canv.setLineWidth(0.6)
    canv.line(MARGIN, 0.44 * inch, PAGE_W - MARGIN, 0.44 * inch)
    canv.setFillColor(SLATE)
    canv.setFont("Helvetica", 6.9)
    canv.drawString(MARGIN, 0.31 * inch,
                    "Independent advisory; views are my own and not those of Anduril Industries. "
                    "Program names referenced are publicly announced.")
    canv.drawRightString(PAGE_W - MARGIN, 0.31 * inch, "andrespino.com")
    canv.restoreState()


COL_GAP = 0.26 * inch
CONTENT_W = PAGE_W - 2 * MARGIN
LEFT_W = CONTENT_W * 0.605
RIGHT_W = CONTENT_W - LEFT_W - COL_GAP


def left_column():
    f = [section("Core competencies"), rule(LEFT_W), Spacer(1, 5)]
    for b in [
        "<b>Undersea vehicles (AUV/UUV)</b> — vehicle electrical architecture, long-endurance operation, in-mission and external recharging, subsea surveillance payload integration.",
        "<b>Maritime energy &amp; power systems</b> — battery systems, power distribution and bus architecture, energy management and regulation, pressure-tolerant power.",
        "<b>Power electronics &amp; system design</b> — power conversion and distribution, precision hardware for harsh environments, prototype-to-production transition.",
        "<b>Navy sonar &amp; acoustics</b> — planar and conformal arrays, towed arrays, dipping sonar, torpedo seekers, transducer R&amp;D, acoustic test and acceptance.",
        "<b>Directed energy</b> — HEL power architecture and scaling, airborne pod integration, weapon-system control segments.",
    ]:
        f.append(bullet(b))

    f += [Spacer(1, 8), section("Past performance"), rule(LEFT_W), Spacer(1, 5)]
    perf = [
        ("Anduril Industries", "2026 – present",
         "Power Electronics and Energy Systems Engineer, Maritime Enabling Technologies. Leads the energy subsystem for an ultra-long-range maritime autonomous vehicle — storage, distribution, regulation, and external charging, from concept through production."),
        ("General Atomics Electromagnetic Systems", "2025 – 2026",
         "Senior Manager, Power Electronics &amp; System Design. Led the group supporting high-energy laser and electro-optical programs from $50M to $350M+; technical lead on a $90M Reaper-mounted HEL program through PDR."),
        ("L3Harris Technologies", "2021 – 2025",
         "Chief Engineer / Senior Manager. Directed Navy sonar programs (MK54, LWWAA, HELRAS, TB-29, TB-34A) and led a $50M/yr engineering facility, securing over $150M in new contracts; interfaced directly with NUWC and ONR."),
        ("Terradepth", "2020 – 2021",
         "Lead Electrical Engineer. Led electrical development of long-endurance AUVs, including a novel heavy-fuel generator for autonomous in-mission battery recharging — one of the longest-endurance vehicles in its class."),
        ("Lockheed Martin", "2014 – 2019",
         "Senior Electrical Engineer. Electrical lifecycle of the Marlin AUV and the RAP-VLA undersea surveillance system; senior lead hardware engineer on the Layered Laser Defense prototype."),
    ]
    for org, yrs, body in perf:
        head = Table([[Paragraph(org, S_ROLE), Paragraph(yrs, S_META)]],
                     colWidths=[LEFT_W * 0.68, LEFT_W * 0.32])
        head.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ]))
        f += [head, Paragraph(body, S_BODY_SM), Spacer(1, 3)]
    return f


def right_column():
    f = [section("Differentiators"), rule(RIGHT_W), Spacer(1, 5)]
    for b in [
        "Currently building ultra-long-range maritime autonomy at Anduril Industries.",
        "Twenty years carrying undersea and defense hardware from concept through integration, test, manufacturing, and fleet delivery.",
        "Rare span across undersea autonomy, Navy acoustics, and directed energy, with the power and energy systems common to all three.",
        "Chief-engineer and P&amp;L experience: owned technical, fiscal, and operational accountability for a $50M/yr engineering facility.",
        "Active Top Secret clearance; direct working history with NUWC, ONR, and DoD prime contractors.",
    ]:
        f.append(bullet(b))

    f += [Spacer(1, 8), section("Engagement modes"), rule(RIGHT_W), Spacer(1, 5)]
    for t, d in [
        ("Architecture &amp; design review", "Independent senior review of system architecture, power and energy design, and integration risk ahead of PDR/CDR."),
        ("Trade-space analysis", "Quantified trades on vehicle energy storage, power distribution, pressure-tolerant power, and sonar front-ends."),
        ("Program &amp; technical due diligence", "Independent assessment of an undersea or directed-energy program claim for investors, primes, and program offices."),
        ("Fractional chief engineer", "Ongoing design authority and review cadence for teams shipping maritime or defense hardware."),
    ]:
        f += [Paragraph(f"<b>{t}</b>", S_ROLE), Paragraph(d, S_BODY_SM), Spacer(1, 2)]

    f += [Spacer(1, 8), section("Company data"), rule(RIGHT_W), Spacer(1, 5)]
    rows = [
        ("PRINCIPAL", "Andrés M. Pino, M.S.E.E."),
        ("EDUCATION", "M.S. Electrical Engineering, Johns Hopkins University · B.S. Electrical Engineering, University of Central Florida"),
        ("CLEARANCE", "Active Top Secret"),
        ("LOCATION", "San Diego, California"),
        ("NAICS (PROPOSED)", "541330 Engineering Services · 541715 R&amp;D in Physical, Engineering &amp; Life Sciences · 541690 Other Scientific &amp; Technical Consulting"),
    ]
    # Registration rows print only once real values exist (never placeholders).
    if UEI or CAGE:
        rows.append(("UEI / CAGE", " · ".join(v for v in (UEI, CAGE) if v)))
    if BUSINESS_TYPE:
        rows.append(("BUSINESS TYPE", BUSINESS_TYPE))
    t = Table([[Paragraph(k, S_DATA_K), Paragraph(v, S_DATA_V)] for k, v in rows],
              colWidths=[RIGHT_W * 0.34, RIGHT_W * 0.66])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, HexColor("#e3e9ef")),
    ]))
    f.append(t)
    return f


def build():
    doc = BaseDocTemplate(
        str(OUT), pagesize=LETTER,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=HEADER_H + 0.16 * inch, bottomMargin=0.55 * inch,
        title="Andrés Pino — Capability Statement", author="Andrés Pino",
        subject="Engineering advisory for undersea vehicle and maritime energy programs",
    )
    avail_h = PAGE_H - HEADER_H - 0.16 * inch - doc.bottomMargin
    frame = Frame(MARGIN, doc.bottomMargin, CONTENT_W, avail_h,
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="cs", frames=[frame], onPage=draw_header)])

    body = Table(
        [[KeepInFrame(LEFT_W, avail_h, left_column(), mode="shrink"), "",
          KeepInFrame(RIGHT_W, avail_h, right_column(), mode="shrink")]],
        colWidths=[LEFT_W, COL_GAP, RIGHT_W],
    )
    body.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("LINEBEFORE", (2, 0), (2, 0), 0.5, HexColor("#dde5ec")),
        ("LEFTPADDING", (2, 0), (2, 0), 10),
    ]))
    doc.build([body])
    print("WROTE", OUT)


if __name__ == "__main__":
    build()
