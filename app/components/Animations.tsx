"use client";

import { motion, AnimatePresence, type Variants, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// ── Fade In ──

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Slide Up ──

export function SlideUp({
  children,
  delay = 0,
  duration = 0.35,
  distance = 20,
  className,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -distance }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Slide In from left ──

export function SlideIn({
  children,
  delay = 0,
  duration = 0.35,
  className,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Container ──

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// ── Animated Counter ──

export function AnimatedCounter({
  value,
  duration = 0.8,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    }

    requestAnimationFrame(animate);
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ── Page Transition ──

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Layout Transition (wraps all pages with AnimatePresence) ──

export function LayoutTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Scale on Hover Wrapper ──

export function ScaleOnHover({
  children,
  scale = 1.02,
  className,
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Skeleton Loader ───

export function Skeleton({
  className,
  width,
  height,
  borderRadius = "6px",
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}) {
  return (
    <div
      className={`skeleton-pulse ${className ?? ""}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton height="16px" width="40%" />
      <Skeleton height="28px" width="80%" />
      <Skeleton height="14px" width="60%" />
    </div>
  );
}

export function ExamQuestionSkeleton() {
  return (
    <div className="skeleton-exam" aria-hidden="true">
      <Skeleton height="14px" width="30%" />
      <Skeleton height="20px" width="100%" />
      <Skeleton height="16px" width="95%" />
      <Skeleton height="16px" width="90%" />
      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="52px" width="100%" borderRadius="8px" />
        ))}
      </div>
    </div>
  );
}

// ── Animated Progress Bar ──

export function AnimatedProgressBar({
  value,
  height = 8,
  borderRadius = 999,
  color,
  delay = 0.2,
  duration = 0.6,
  className,
}: {
  value: number;
  height?: number;
  borderRadius?: number;
  color?: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        height,
        borderRadius,
        overflow: "hidden",
        background: "var(--surface-border)",
      }}
    >
      <motion.div
        initial={{ width: "0%" }}
        whileInView={{ width: `${Math.min(value, 100)}%` }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration, delay, ease: "easeOut" }}
        style={{
          height: "100%",
          borderRadius,
          background: color ?? "var(--accent-green)",
        }}
      />
    </div>
  );
}

// ── Animated Score Ring ──

export function AnimatedScoreRing({
  percentage,
  size = 140,
  strokeWidth = 10,
  label = "Score",
  delay = 0.3,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  delay?: number;
}) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 80) return "var(--accent-green)";
    if (pct >= 60) return "#2563eb";
    if (pct >= 40) return "#d97706";
    return "var(--accent-red)";
  };

  const scoreColor = getColor(percentage);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const startTime = performance.now();
    const animDuration = 1.0;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (animDuration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(eased * percentage);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [percentage, hasAnimated]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-border)"
          strokeWidth={strokeWidth}
        />
        {/* Animated arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: "easeOut" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.3, ease: "easeOut" }}
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "var(--page-text)",
            lineHeight: 1,
          }}
        >
          {Math.round(animatedPct)}%
        </motion.span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "var(--muted-text)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
