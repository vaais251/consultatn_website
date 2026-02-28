"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Subtle fade + slide-up on enter. Respects `prefers-reduced-motion`.
 */
export function FadeIn({ children, className, delay = 0 }: MotionWrapperProps) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Card with hover lift + press-down micro-interaction.
 */
export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            whileHover={reduced ? {} : { y: -4, transition: { duration: 0.2 } }}
            whileTap={reduced ? {} : { scale: 0.98 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Staggered list — wrap children that should animate in sequence.
 */
export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={reduced ? {} : {
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            variants={reduced ? {} : {
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
