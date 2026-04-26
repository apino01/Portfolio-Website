// Build Andres Pino's resume as .docx using docx-js.
// Run: node scripts/build-resume.cjs
const fs = require("fs");
const path = require("path");

// Use globally installed docx
const docxPath = path.join(
  process.env.APPDATA || "",
  "npm",
  "node_modules",
  "docx"
);
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  LevelFormat,
  TabStopType,
  TabStopPosition,
  BorderStyle,
  WidthType,
  ShadingType,
  ExternalHyperlink,
  PageOrientation,
  HeadingLevel,
} = require(docxPath);

// ─── Style tokens ───
const FONT = "Calibri";
const COLOR_BODY = "1F2937"; // dark slate
const COLOR_MUTED = "475569"; // slate
const COLOR_RULE = "94A3B8"; // light slate
const COLOR_ACCENT = "0F3257"; // deep navy

// 1 inch = 1440 DXA
const inch = (n) => Math.round(n * 1440);
// pt → docx half-points
const pt = (n) => Math.round(n * 2);

// ─── Helpers ───
const hairline = {
  bottom: {
    style: BorderStyle.SINGLE,
    size: 6, // ~0.75pt
    color: COLOR_RULE,
    space: 4,
  },
};

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = {
  top: noBorder,
  bottom: noBorder,
  left: noBorder,
  right: noBorder,
  insideHorizontal: noBorder,
  insideVertical: noBorder,
};
const noCellBorders = {
  top: noBorder,
  bottom: noBorder,
  left: noBorder,
  right: noBorder,
};

// Section heading: small caps, bold, hairline rule beneath
const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 240, after: 120 },
    border: hairline,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(11),
        bold: true,
        smallCaps: true,
        color: COLOR_ACCENT,
        characterSpacing: 30,
      }),
    ],
  });

// Body paragraph
const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 80, line: 264 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(opts.size ?? 10),
        color: opts.color ?? COLOR_BODY,
        italics: opts.italics ?? false,
        bold: opts.bold ?? false,
      }),
    ],
  });

// Role header: company+location LEFT, dates RIGHT (tab-stopped)
const roleHeader = (companyLocation, dates) =>
  new Paragraph({
    spacing: { before: 160, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 10512 }],
    children: [
      new TextRun({
        text: companyLocation,
        font: FONT,
        size: pt(10.5),
        bold: true,
        color: COLOR_BODY,
      }),
      new TextRun({
        text: `\t${dates}`,
        font: FONT,
        size: pt(10),
        color: COLOR_MUTED,
      }),
    ],
  });

// Role title (italic, second line)
const roleTitle = (text) =>
  new Paragraph({
    spacing: { after: 80, before: 0 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(10),
        italics: true,
        color: COLOR_ACCENT,
      }),
    ],
  });

// Sub-role title (e.g. for the L3 LLD subsection at LM Baltimore)
const subRoleTitle = (text) =>
  new Paragraph({
    spacing: { before: 100, after: 60 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(10),
        italics: true,
        color: COLOR_ACCENT,
      }),
    ],
  });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60, line: 256 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: pt(10),
        color: COLOR_BODY,
      }),
    ],
  });

// Header table: name + tagline LEFT, contact RIGHT
const buildHeader = () => {
  const left = new TableCell({
    width: { size: 6300, type: WidthType.DXA },
    borders: noCellBorders,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    children: [
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: "ANDRÉS PINO",
            font: FONT,
            size: pt(22),
            bold: true,
            color: COLOR_ACCENT,
            characterSpacing: 20,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: "Senior Electrical & Systems Engineering Leader",
            font: FONT,
            size: pt(10.5),
            color: COLOR_MUTED,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 0, line: 252 },
        children: [
          new TextRun({
            text:
              "Power Electronics  ·  Directed Energy  ·  Sonar  ·  Undersea Autonomy  ·  System Architecture",
            font: FONT,
            size: pt(9),
            color: COLOR_MUTED,
          }),
        ],
      }),
    ],
  });

  const right = new TableCell({
    width: { size: 4212, type: WidthType.DXA },
    borders: noCellBorders,
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: "San Diego, CA",
            font: FONT,
            size: pt(10),
            bold: true,
            color: COLOR_BODY,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new ExternalHyperlink({
            link: "https://andrespino.com",
            children: [
              new TextRun({
                text: "andrespino.com",
                font: FONT,
                size: pt(10),
                color: COLOR_ACCENT,
                underline: { type: "single", color: COLOR_ACCENT },
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new ExternalHyperlink({
            link: "mailto:andres.m.pino@gmail.com",
            children: [
              new TextRun({
                text: "andres.m.pino@gmail.com",
                font: FONT,
                size: pt(10),
                color: COLOR_ACCENT,
                underline: { type: "single", color: COLOR_ACCENT },
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [
          new ExternalHyperlink({
            link: "https://linkedin.com/in/andresmpino",
            children: [
              new TextRun({
                text: "linkedin.com/in/andresmpino",
                font: FONT,
                size: pt(10),
                color: COLOR_ACCENT,
                underline: { type: "single", color: COLOR_ACCENT },
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 60, after: 0 },
        children: [
          new TextRun({
            text: "Active Top Secret Clearance",
            font: FONT,
            size: pt(9.5),
            italics: true,
            color: COLOR_MUTED,
          }),
        ],
      }),
    ],
  });

  return new Table({
    width: { size: 10512, type: WidthType.DXA },
    columnWidths: [6300, 4212],
    borders: noBorders,
    rows: [new TableRow({ children: [left, right] })],
  });
};

// ─── Document content ───
const children = [
  buildHeader(),

  // Hairline rule below header
  new Paragraph({
    spacing: { before: 120, after: 0 },
    border: hairline,
    children: [new TextRun("")],
  }),

  // PROFESSIONAL SUMMARY
  sectionHeading("Professional Summary"),
  body(
    "Senior engineering leader with 20 years architecting and delivering complex hardware systems for defense and maritime customers — power electronics, directed energy, sonar, and undersea autonomy. Lead multi-disciplinary teams across the full product lifecycle from concept and architecture through integration, test, and customer delivery. Programs span $50M–$350M+ across General Atomics, L3Harris, Terradepth, and Lockheed Martin. MS Electrical Engineering, Johns Hopkins (power electronics)."
  ),

  // CORE COMPETENCIES
  sectionHeading("Core Competencies"),
  new Paragraph({
    spacing: { after: 60, line: 280 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text:
          "Power Electronics  ·  Directed Energy / HEL  ·  Electro-Optical Systems  ·  Sonar & Acoustics  ·  Undersea Autonomy  ·  Systems Engineering  ·  Hardware Lifecycle  ·  R&D Leadership  ·  Technical Leadership  ·  System Architecture  ·  Team Management  ·  Program Execution",
        font: FONT,
        size: pt(10),
        color: COLOR_BODY,
      }),
    ],
  }),

  // PROFESSIONAL EXPERIENCE
  sectionHeading("Professional Experience"),

  // GA-EMS
  roleHeader(
    "General Atomics Electromagnetic Systems — San Diego, CA",
    "Aug 2025 – Present"
  ),
  roleTitle("Senior Manager — Power Electronics & System Design"),
  bullet(
    "Lead a team of 5 power electronics engineers supporting high energy laser (HEL) and electro-optical system programs ranging from $50M to $350M+, serving as principal technical authority on design reviews and system architecture decisions."
  ),
  bullet(
    "Technical lead on a Reaper-mounted HEL weapon system program, driving the team from development through system integration to flight demonstration. Drove the team through critical design milestones on an aggressive delivery schedule."
  ),
  bullet(
    "Serve as primary engineering stakeholder across multiple programs, collaborating with program managers to ensure proper staffing, resource allocation, and technical execution of power electronics subsystems."
  ),
  bullet(
    "Provide architectural oversight and design review authority for ground-based and airborne directed energy programs, ensuring system performance, reliability, and compliance with customer requirements."
  ),

  // L3Harris
  roleHeader("L3Harris Technologies — Salt Lake City, UT", "Jun 2021 – Jul 2025"),
  roleTitle("Chief Engineer / Senior Manager"),
  bullet(
    "Directed complex Navy sonar programs (MK54, LWWAA, HELRAS, TB-29, TB-34A sensors), orchestrating cross-functional Acoustic, Integration & Test, and Specialty Engineering teams to meet strategic milestones."
  ),
  bullet(
    "Led technical, fiscal, and operational management for all engineering programs, securing contracts worth over $150M while managing a facility generating over $50M annually. Achieved corporate financial targets including Free Cash Flow, Operating Income, and Return on Sales through innovative bids and budget oversight."
  ),
  bullet(
    "Drove R&D of advanced textured ceramic technology, directing Ph.D.-level scientists and specialists to enhance material performance and refine manufacturing processes for next-generation transducer systems."
  ),
  bullet(
    "Expanded the customer base by directly interfacing with key stakeholders at Naval Undersea Warfare Center (NUWC) and Office of Naval Research (ONR), establishing relationships that accelerated product adoption and technology transition."
  ),

  // Terradepth
  roleHeader("Terradepth — Austin, TX", "Feb 2020 – May 2021"),
  roleTitle("Lead Electrical Engineer"),
  bullet(
    "Led development of state-of-the-art Autonomous Underwater Vehicles (AUVs), leveraging advanced machine learning and AI technologies to meet stringent functional and sustainability standards in challenging marine environments."
  ),
  bullet(
    "Owned the complete lifecycle of electrical system development, from research and design to parts procurement and final integration. Delivered sophisticated electrical architectures that enhanced overall system performance and reliability."
  ),
  bullet(
    "Developed a novel heavy fuel generator system for autonomous recharging of lithium polymer batteries, extending the AUVs' operational endurance to one of the longest in class."
  ),

  // LM Baltimore
  roleHeader("Lockheed Martin — Baltimore, MD", "Nov 2014 – Jul 2019"),
  roleTitle("Senior Electrical Engineer — Advanced Technical Leadership Program"),
  bullet(
    "Managed a $350K R&D budget and a $4M Machinery Plant Control and Monitoring System (MPCMS) hardware budget critical to the operational success of Littoral Combat Ships."
  ),
  bullet(
    "Led a team of 7 engineers developing key hardware projects, including layered laser defense systems, ballistic missile defense vertical launch systems, and SM-3 Block IIA missile integration and testing."
  ),
  bullet(
    "Drove the frigate proposal process, overseeing down-selection and bid development and shaping the cost-model analysis for competitive proposals."
  ),

  subRoleTitle(
    "Senior Lead Hardware Engineer — Layered Laser Defense (R&D prototype laser weapon system)"
  ),
  bullet(
    "Led R&D of a pioneering layered laser defense system, developing critical components including the Weapon System Control Segment."
  ),
  bullet(
    "Engineered and assembled lab test units for comprehensive system verification. Delivered a full-system prototype for Integration and Testing (I&T), preparing it for operational deployment."
  ),
  bullet(
    "Guided a team through system design and prototype development, ensuring all components were integrated and met rigorous testing standards prior to field tests."
  ),

  // LM Palm Beach
  roleHeader("Lockheed Martin — Palm Beach, FL", "May 2008 – Nov 2014"),
  roleTitle(
    "Lead Electrical Engineer — Marlin AUV Program (first commercial enterprise at LM Palm Beach; designed to survey offshore oil platforms, pipelines, and more)"
  ),
  bullet(
    "Led operation, maintenance, and system integration of Marlin AUVs, including troubleshooting and repairs at the component level. Ensured delivery of thoroughly tested and compliant vehicles within strict budget and schedule constraints."
  ),
  bullet(
    "Designed and implemented advanced sonar suites, enhancing vehicle capabilities to meet critical customer requirements. Managed architectural development from system schematics to power distribution and network architecture, improving manufacturability, reproducibility, and reliability."
  ),
  bullet(
    "Directed a multidisciplinary team of engineers, technicians, and assistants, coordinating full-system assembly of AUVs. Developed and executed detailed test procedures for sub-systems and integrated equipment."
  ),

  subRoleTitle(
    "Lead Electrical Engineer — RAP-VLA (rapidly deployable, autonomous detection, classification, and localization passive acoustic surveillance system)"
  ),
  bullet(
    "Created a rapidly deployable, autonomous passive acoustic surveillance system from concept through fully functional prototype. Oversaw integration and testing of complex sub-sea systems."
  ),
  bullet(
    "Engineered custom power PCBs and innovative pressure-compensated alkaline battery systems, optimizing for low power consumption and high reliability in deep-ocean environments. Managed the full lifecycle of electronic design including system requirements, product selection, and assembly coordination."
  ),
  bullet(
    "Produced comprehensive electrical documentation including system schematics, interconnect diagrams, and power distribution frameworks, meeting rigorous testing and operational standards."
  ),

  // EDUCATION
  sectionHeading("Education"),
  new Paragraph({
    spacing: { before: 60, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 10512 }],
    children: [
      new TextRun({
        text: "Johns Hopkins University, Whiting School of Engineering",
        font: FONT,
        size: pt(10.5),
        bold: true,
        color: COLOR_BODY,
      }),
      new TextRun({
        text: "\tBaltimore, MD",
        font: FONT,
        size: pt(10),
        color: COLOR_MUTED,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text:
          "MS Electrical Engineering (Engineering for Professionals) — Power electronics and analog circuit design",
        font: FONT,
        size: pt(10),
        italics: true,
        color: COLOR_ACCENT,
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 40, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: 10512 }],
    children: [
      new TextRun({
        text: "University of Central Florida",
        font: FONT,
        size: pt(10.5),
        bold: true,
        color: COLOR_BODY,
      }),
      new TextRun({
        text: "\tOrlando, FL",
        font: FONT,
        size: pt(10),
        color: COLOR_MUTED,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: "BS Electrical Engineering — Microelectronics",
        font: FONT,
        size: pt(10),
        italics: true,
        color: COLOR_ACCENT,
      }),
    ],
  }),
];

// ─── Document ───
const doc = new Document({
  creator: "Andrés Pino",
  title: "Andrés Pino — Resume",
  description:
    "Senior Electrical & Systems Engineering Leader. Power Electronics, Directed Energy, Sonar, Undersea Autonomy.",
  styles: {
    default: {
      document: { run: { font: FONT, size: pt(10), color: COLOR_BODY } },
    },
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: 360, hanging: 200 } },
              run: { color: COLOR_ACCENT },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter
          margin: {
            top: inch(0.6),
            right: inch(0.6),
            bottom: inch(0.6),
            left: inch(0.6),
          },
        },
      },
      children,
    },
  ],
});

const out = path.resolve(
  "C:/Users/Andres/My Drive/Documents/Claude/portfolio/Andres Pino Resume.docx"
);
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log(`OK ${out} (${buf.length} bytes)`);
});
