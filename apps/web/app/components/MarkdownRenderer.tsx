"use client";

import { marked } from "marked";
import { useMemo } from "react";

// Configure marked for safe rendering
marked.setOptions({
    breaks: true,
    gfm: true,
});

// Basic HTML sanitization — strips dangerous tags/attributes
function sanitizeHtml(html: string): string {
    // Remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/on\w+="[^"]*"/gi, "")
        .replace(/on\w+='[^']*'/gi, "")
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
        .replace(/<embed\b[^>]*>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/data:text\/html/gi, "");
}

export default function MarkdownRenderer({ content }: { content: string }) {
    const html = useMemo(() => {
        const rawHtml = marked(content) as string;
        return sanitizeHtml(rawHtml);
    }, [content]);

    return (
        <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
