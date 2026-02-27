import { z } from "zod";

// ─── Slug helper ────────────────────────────────────────

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ─── Registration ───────────────────────────────────────

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    country: z.string().optional(),
});

// ─── Destination ────────────────────────────────────────

export const destinationSchema = z.object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    heroImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    summary: z.string().min(10, "Summary must be at least 10 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    region: z.string().min(2, "Region is required"),
    difficulty: z.string().optional().or(z.literal("")),
    bestSeason: z.string().optional().or(z.literal("")),
    isPublished: z.boolean().default(false),
});

export type DestinationInput = z.infer<typeof destinationSchema>;

// ─── Blog Post ──────────────────────────────────────────

export const blogPostSchema = z.object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
    excerpt: z.string().optional().or(z.literal("")),
    coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    content: z.string().optional().or(z.literal("")),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// ─── Contact Form ───────────────────────────────────────

export const contactSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});
