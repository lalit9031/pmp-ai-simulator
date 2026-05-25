/**
 * Central configuration for all supported certifications.
 * Each certification defines its exam format, free topics, and display metadata.
 */

export type CertSlug = "pmp" | "pmi-acp" | "capm" | "csm" | "psm-i" | "six-sigma";

export type CertType = "exam" | "learning";

export type DomainOption = {
  label: string;
  paidOnly?: boolean;
};

export type Certification = {
  slug: CertSlug;
  title: string;
  shortName: string;
  description: string;
  type: CertType;
  /** Number of exam questions (for exam type) */
  totalQuestions: number;
  /** Time limit in minutes (for exam type) */
  timeLimitMinutes: number;
  /** Domain filter options for the exam page */
  domains: DomainOption[];
  /** Default domain */
  defaultDomain: string;
  /** Difficulty options */
  difficulties: string[];
  /** Topic slugs that are free to all users */
  freeTopicSlugs: string[];
  /** All learning topic slugs for this certification */
  topicSlugs: string[];
  /** Icon emoji for cards */
  icon: string;
  /** Color for branding */
  color: string;
  /** Storage key prefix for localStorage isolation */
  storagePrefix: string;
};

export const certifications: Record<CertSlug, Certification> = {
  pmp: {
    slug: "pmp",
    title: "PMP Simulator",
    shortName: "PMP",
    description: "Project Management Professional — timed 185-question PMP-style exam simulation with AI questions.",
    type: "exam",
    totalQuestions: 185,
    timeLimitMinutes: 240,
    domains: [
      { label: "Mixed" },
      { label: "Agile" },
      { label: "Risk" },
      { label: "Stakeholder" },
      { label: "Hybrid" },
      { label: "AI Ethics", paidOnly: true },
      { label: "Sustainability", paidOnly: true },
      { label: "Business Environment", paidOnly: true },
    ],
    defaultDomain: "Mixed",
    difficulties: ["Mixed", "Easy", "Medium", "Hard"],
    freeTopicSlugs: ["agile", "risk", "stakeholder", "hybrid"],
    topicSlugs: ["agile", "risk", "stakeholder", "hybrid", "ai", "sustainability", "value"],
    icon: "📋",
    color: "#2563eb",
    storagePrefix: "pmp",
  },
  "pmi-acp": {
    slug: "pmi-acp",
    title: "PMI-ACP Simulator",
    shortName: "PMI-ACP",
    description: "Agile Certified Practitioner — 120-question agile-focused exam simulation covering Lean, Kanban, XP, and Scrum.",
    type: "exam",
    totalQuestions: 120,
    timeLimitMinutes: 180,
    domains: [
      { label: "Mixed" },
      { label: "Agile Principles" },
      { label: "Value-Driven Delivery" },
      { label: "Stakeholder Engagement" },
      { label: "Team Performance" },
      { label: "Adaptive Planning" },
      { label: "Problem Detection & Resolution" },
      { label: "Continuous Improvement", paidOnly: true },
    ],
    defaultDomain: "Mixed",
    difficulties: ["Mixed", "Easy", "Medium", "Hard"],
    freeTopicSlugs: ["agile-principles", "value-driven-delivery"],
    topicSlugs: ["agile-principles", "value-driven-delivery", "stakeholder-engagement-acp", "team-performance", "adaptive-planning"],
    icon: "🔄",
    color: "#7c3aed",
    storagePrefix: "pmi-acp",
  },
  capm: {
    slug: "capm",
    title: "CAPM Simulator",
    shortName: "CAPM",
    description: "Certified Associate in Project Management — 150-question foundational exam covering PMBOK principles and processes.",
    type: "exam",
    totalQuestions: 150,
    timeLimitMinutes: 180,
    domains: [
      { label: "Mixed" },
      { label: "Project Fundamentals" },
      { label: "Predictive Methods" },
      { label: "Agile Methods" },
      { label: "Business Analysis" },
    ],
    defaultDomain: "Mixed",
    difficulties: ["Mixed", "Easy", "Medium", "Hard"],
    freeTopicSlugs: ["project-fundamentals", "predictive-methods"],
    topicSlugs: ["project-fundamentals", "predictive-methods", "agile-methods-capm", "business-analysis-capm"],
    icon: "🎯",
    color: "#16a34a",
    storagePrefix: "capm",
  },
  csm: {
    slug: "csm",
    title: "CSM Simulator",
    shortName: "CSM",
    description: "Certified ScrumMaster — 50-question exam on Scrum framework, events, artifacts, and the ScrumMaster role.",
    type: "exam",
    totalQuestions: 50,
    timeLimitMinutes: 60,
    domains: [
      { label: "Mixed" },
      { label: "Scrum Theory" },
      { label: "Scrum Events" },
      { label: "Scrum Artifacts" },
      { label: "ScrumMaster Role" },
      { label: "Development Team" },
    ],
    defaultDomain: "Mixed",
    difficulties: ["Mixed", "Easy", "Medium", "Hard"],
    freeTopicSlugs: ["scrum-theory", "scrum-events"],
    topicSlugs: ["scrum-theory", "scrum-events", "scrum-artifacts", "scrum-master-role"],
    icon: "🏅",
    color: "#db2777",
    storagePrefix: "csm",
  },
  "psm-i": {
    slug: "psm-i",
    title: "PSM I Simulator",
    shortName: "PSM I",
    description: "Professional Scrum Master I — 80-question assessment on Scrum mastery, evidence-based management, and agile principles.",
    type: "exam",
    totalQuestions: 80,
    timeLimitMinutes: 60,
    domains: [
      { label: "Mixed" },
      { label: "Scrum Fundamentals" },
      { label: "Empiricism" },
      { label: "Scrum Roles" },
      { label: "Scrum Events & Artifacts" },
      { label: "Done & Forecasting" },
    ],
    defaultDomain: "Mixed",
    difficulties: ["Mixed", "Easy", "Medium", "Hard"],
    freeTopicSlugs: ["scrum-fundamentals", "empiricism"],
    topicSlugs: ["scrum-fundamentals", "empiricism", "scrum-roles-psm", "scrum-events-artifacts-psm"],
    icon: "⚡",
    color: "#ea580c",
    storagePrefix: "psm-i",
  },
  "six-sigma": {
    slug: "six-sigma",
    title: "Six Sigma Green/Black Belt",
    shortName: "Six Sigma",
    description: "Six Sigma Green/Black Belt practice exam with DMAIC, SPC, Lean, MSA, and process improvement questions. Includes full learning modules.",
    type: "exam",
    totalQuestions: 50,
    timeLimitMinutes: 90,
    domains: [
      { label: "Mixed" },
      { label: "DMAIC" },
      { label: "Process Mapping" },
      { label: "SPC" },
      { label: "Lean" },
      { label: "MSA" },
      { label: "Waste Reduction", paidOnly: true },
    ],
    defaultDomain: "Mixed",
    difficulties: ["Mixed", "Easy", "Medium", "Hard"],
    freeTopicSlugs: ["dmaic-overview", "process-mapping"],
    topicSlugs: ["dmaic-overview", "process-mapping", "statistical-process-control", "lean-principles", "measurement-system-analysis"],
    icon: "📊",
    color: "#ca8a04",
    storagePrefix: "six-sigma",
  },
};

export function getCertification(slug: string | null): Certification {
  if (slug && slug in certifications) {
    return certifications[slug as CertSlug];
  }
  return certifications.pmp;
}

export function getExamCertifications(): Certification[] {
  return Object.values(certifications).filter((c) => c.type === "exam");
}

export function getLearningCertifications(): Certification[] {
  return Object.values(certifications).filter((c) => c.type === "learning");
}

export function isPaidCertSlug(slug: string): boolean {
  return ["pmp", "pmi-acp", "capm", "csm", "psm-i", "six-sigma"].includes(slug);
}

/** Map cert slug to storage key prefix */
export function certStorageKey(key: string, certSlug: CertSlug = "pmp"): string {
  return `pmp-simulator-${certifications[certSlug].storagePrefix}-${key}`;
}
