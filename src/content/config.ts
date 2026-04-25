import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    organization: z.string(),
    role: z.string(),
    year: z.string(),
    domain: z.enum([
      "Power Electronics",
      "Electro-Optical / Directed Energy",
      "Undersea Autonomy",
      "SONAR",
      "Surface Combatant",
    ]),
    externalUrl: z.string().url().optional(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const experience = defineCollection({
  type: "content",
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    current: z.boolean().default(false),
    summary: z.string(),
    bullets: z.array(z.string()).default([]),
    order: z.number(),
  }),
});

export const collections = { projects, experience };
