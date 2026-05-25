import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  getCertification,
  type CertSlug,
} from "../../certifications";

// ── Fallback questions per certification ──

type FallbackMap = Record<string, typeof pmbFallback>;

const pmbFallback = {
  question:
    "A hybrid project team is struggling because agile team members want frequent backlog changes while the predictive team needs stable requirements for compliance deliverables. What should the project manager do first?",
  options: [
    "Escalate the disagreement to the sponsor for a final decision",
    "Facilitate a working session to align on delivery approach, constraints, and change-handling expectations",
    "Ask the agile team to stop accepting changes until the predictive work is complete",
    "Update the project charter to make the predictive approach mandatory for all teams",
  ],
  correctAnswer: 1,
  explanation:
    "The project manager should first facilitate collaboration and alignment. PMI mindset favors servant leadership, shared understanding, and using the appropriate governance approach before escalating or imposing a solution.",
  whyOthersWrong: [
    "Escalation is premature before the project manager facilitates alignment and clarifies the real constraints.",
    "This is correct because it creates shared understanding and an agreed way to manage change across both delivery approaches.",
    "Freezing all changes ignores agile value delivery and may block legitimate priority changes.",
    "Mandating one approach for every team is a unilateral process change that may not fit the hybrid context.",
  ],
  mindsetTip:
    "PMI mindset: collaborate first, clarify constraints, then tailor the delivery approach instead of forcing one method.",
  domain: "Hybrid",
  topic: "Hybrid Delivery Governance",
  difficulty: "Medium",
  source: "fallback",
};

const pmiAcpFallback = {
  question:
    "During a Sprint, the Product Owner asks the team to add a new high-priority user story to the current Sprint Backlog. The team has already committed to the Sprint Goal. What should the Scrum Master do?",
  options: [
    "Accept the story and adjust the Sprint Backlog immediately",
    "Remind the Product Owner that the Sprint Backlog is frozen once the Sprint starts",
    "Facilitate a discussion between the Product Owner and the team about whether the new story justifies changing the Sprint Goal",
    "Ask the team to work overtime to accommodate the new story",
  ],
  correctAnswer: 2,
  explanation:
    "The Scrum Master coaches the Product Owner and the team. The Product Owner may negotiate scope changes, but the team can refuse if it threatens the Sprint Goal. Facilitation is preferred over rigid rules or unilateral decisions.",
  whyOthersWrong: [
    "Unilaterally accepting the story without team agreement undermines the development team's autonomy.",
    "The Sprint Backlog is not frozen; scope can be clarified or renegotiated with the team, but it should not disrupt the Sprint Goal.",
    "This is correct because it opens a conversation between the PO and the team to evaluate trade-offs against the Sprint Goal.",
    "Asking the team to work overtime contradicts agile principles of sustainable pace and is not a standard Scrum practice.",
  ],
  mindsetTip:
    "Agile mindset: balance responsiveness with commitment — the Sprint Goal provides focus, but the team and PO can collaborate to adapt scope when it adds real value.",
  domain: "Agile Principles",
  topic: "Sprint Backlog Management",
  difficulty: "Medium",
  source: "fallback",
};

const capmFallback = {
  question:
    "A project manager is defining the project scope. Which process group includes the creation of the Work Breakdown Structure (WBS)?",
  options: [
    "Initiating",
    "Planning",
    "Executing",
    "Monitoring and Controlling",
  ],
  correctAnswer: 1,
  explanation:
    "The WBS is created during the Planning process group as part of the 'Create WBS' process. It decomposes the project scope into manageable deliverables and is an input to defining activities, estimating costs, and establishing the baseline.",
  whyOthersWrong: [
    "The Initiating process group authorizes the project but does not include scope decomposition like the WBS.",
    "This is correct. The WBS is a planning output that breaks down the total project scope into work packages.",
    "Executing focuses on completing the work defined in the project management plan, not on defining the WBS.",
    "Monitoring and Controlling tracks performance against baselines, including the WBS, but does not create it.",
  ],
  mindsetTip:
    "CAPM mindset: the WBS is a foundational planning tool — it bridges scope definition and detailed planning. Master the order: Scope Statement → WBS → WBS Dictionary.",
  domain: "Project Fundamentals",
  topic: "Scope Management / WBS",
  difficulty: "Easy",
  source: "fallback",
};

const csmFallback = {
  question:
    "Who is responsible for ordering the Product Backlog to maximize the value of the work the Development Team performs?",
  options: [
    "The Scrum Master",
    "The Development Team",
    "The Product Owner",
    "The stakeholders",
  ],
  correctAnswer: 2,
  explanation:
    "The Product Owner is accountable for Product Backlog management, including ordering the items to best achieve goals and missions. The Scrum Master coaches but does not own the backlog order.",
  whyOthersWrong: [
    "The Scrum Master facilitates Scrum processes and coaches the team but does not own backlog ordering.",
    "The Development Team provides estimates and technical input but does not own the priority order.",
    "This is correct. The Product Owner is the sole person responsible for managing the Product Backlog.",
    "Stakeholders provide input and feedback, but the Product Owner owns prioritization decisions.",
  ],
  mindsetTip:
    "ScrumMaster mindset: the PO owns the 'what' and 'why' (backlog order), the Dev Team owns the 'how' (effort and design). The SM ensures this accountability is clear.",
  domain: "Scrum Artifacts",
  topic: "Product Backlog Ownership",
  difficulty: "Easy",
  source: "fallback",
};

const psmIFallback = {
  question:
    "The Development Team realizes during the Sprint that they will not complete all the items in the Sprint Backlog. What must happen next?",
  options: [
    "The Sprint is immediately cancelled",
    "The Sprint Backlog is renegotiated with the Product Owner to remove items",
    "The Sprint Goal is reduced in scope without consulting the Product Owner",
    "Nothing — the Sprint continues and incomplete items are discussed during the Sprint Review and returned to the Product Backlog",
  ],
  correctAnswer: 3,
  explanation:
    "In Scrum, only the Development Team can decide what it can commit to for a Sprint. If some backlog items are incomplete, the Sprint continues toward the Sprint Goal. The Sprint Review provides transparency, and unfinished items go back to the Product Backlog for future prioritization.",
  whyOthersWrong: [
    "Cancelling a Sprint is a drastic step typically reserved for when the Sprint Goal becomes obsolete, not for incomplete work.",
    "Renegotiating the Sprint Backlog mid-Sprint to remove items is not the standard flow — transparency and adaptation happen at Sprint Review.",
    "Changing the Sprint Goal without involving the Product Owner violates Scrum's accountability structure.",
    "This is correct. The Sprint is a timebox; incomplete items are transparently reviewed and re-prioritized.",
  ],
  mindsetTip:
    "PSM I mindset: Sprint Backlog is a forecast, not a contract. Inspect progress transparently; adapt through the Sprint Review and Retrospective, not mid-Sprint scope cuts.",
  domain: "Scrum Fundamentals",
  topic: "Sprint Backlog Commitment",
  difficulty: "Medium",
  source: "fallback",
};

const sixSigmaFallback = {
  question:
    "A process improvement team has completed the Measure phase of DMAIC and collected baseline data. Which tool is most appropriate to identify the vital few X's (input factors) that have the greatest impact on the output Y?",
  options: [
    "Control Chart",
    "Pareto Chart",
    "Process Map",
    "Gage R&R Study",
  ],
  correctAnswer: 1,
  explanation:
    "After measuring baseline performance, a Pareto Chart helps prioritize the most significant contributing factors (the 'vital few' vs. the 'trivial many'), guiding the team to focus improvement efforts where they will have the greatest impact on the output.",
  whyOthersWrong: [
    "Control Charts monitor process stability over time, not identify the most impactful X factors.",
    "This is correct. The Pareto principle (80/20 rule) helps identify which inputs cause the majority of problems.",
    "Process Maps show the flow of steps but do not prioritize which inputs matter most.",
    "Gage R&R studies assess measurement system variation, not the relative importance of input factors.",
  ],
  mindsetTip:
    "Six Sigma mindset: Define → Measure → Analyze → Improve → Control. Use data to separate the 'vital few' from the 'trivial many' before investing in improvements.",
  domain: "DMAIC",
  topic: "DMAIC Analyze Phase — Pareto Analysis",
  difficulty: "Medium",
  source: "fallback",
};

const fallbackByCert: FallbackMap = {
  pmp: pmbFallback,
  "pmi-acp": pmiAcpFallback,
  capm: capmFallback,
  csm: csmFallback,
  "psm-i": psmIFallback,
  "six-sigma": sixSigmaFallback,
};

// ── Prompt templates per certification ──

function buildSystemPrompt(
  certSlug: string,
  domain: string,
  difficulty: string,
): string {
  const promptTemplates: Record<string, string> = {
    pmp: `Generate one PMP-style ${difficulty.toLowerCase()} question for "${domain}" practice.

Requirements:
- Scenario-based with realistic project context (agile, predictive, or hybrid)
- 4 options with one correct answer
- Align with PMI mindset (servant leadership, stakeholder engagement, value delivery)
- Include concise explanation covering the rationale
- Include why each of the 4 options is right or wrong
- Include a PMI mindset tip
- Include a short topic label (e.g., "Risk Response", "Stakeholder Engagement")
- Avoid trick wording; make the best answer defensible through PMP logic

Return ONLY valid JSON with fields: question, options, correctAnswer, explanation, whyOthersWrong, mindsetTip, domain, topic, difficulty`,

    "pmi-acp": `Generate one PMI-ACP®-style ${difficulty.toLowerCase()} question for "${domain}" practice.

This is for the PMI Agile Certified Practitioner (PMI-ACP) exam. The question should be relevant to the following domain: ${domain}.

Requirements:
- Scenario-based with agile project context (Scrum, Kanban, XP, Lean, or hybrid agile)
- 4 options with one correct answer
- Align with agile values and principles (Agile Manifesto, Lean thinking, value-driven delivery)
- Focus on: adaptive planning, stakeholder engagement, team performance, continuous improvement
- Include concise explanation covering the rationale
- Include why each of the 4 options is right or wrong
- Include an agile mindset tip
- Include a short topic label
- Avoid trick wording

Return ONLY valid JSON with fields: question, options, correctAnswer, explanation, whyOthersWrong, mindsetTip, domain, topic, difficulty`,

    capm: `Generate one CAPM®-style ${difficulty.toLowerCase()} question for "${domain}" practice.

This is for the Certified Associate in Project Management (CAPM) exam, which tests foundational knowledge of the PMBOK® Guide processes, process groups, and knowledge areas.

Requirements:
- Focus on fundamental project management concepts, process groups, and knowledge areas
- 4 options with one correct answer
- Questions should test recall and understanding of PMBOK processes (e.g., "Which process group includes create WBS?", "What is an input to develop project charter?")
- Include concise explanation covering the rationale
- Include why each of the 4 options is right or wrong
- Include a CAPM study tip
- Include a short topic label
- Avoid trick wording

Return ONLY valid JSON with fields: question, options, correctAnswer, explanation, whyOthersWrong, mindsetTip, domain, topic, difficulty`,

    csm: `Generate one CSM® (Certified ScrumMaster)-style ${difficulty.toLowerCase()} question for "${domain}" practice.

This is for the Scrum Alliance CSM exam. Questions focus on the Scrum framework as defined in the Scrum Guide™.

Requirements:
- Scenario-based using Scrum events (Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective), artifacts (Product Backlog, Sprint Backlog, Increment), and roles (Product Owner, Scrum Master, Development Team)
- 4 options with one correct answer
- Align with Scrum Guide 2020 definitions and accountabilities
- Focus on the ScrumMaster's role: coaching, facilitation, removing impediments
- Include concise explanation covering the rationale
- Include why each of the 4 options is right or wrong
- Include a Scrum mastery tip
- Include a short topic label
- Avoid trick wording

Return ONLY valid JSON with fields: question, options, correctAnswer, explanation, whyOthersWrong, mindsetTip, domain, topic, difficulty`,

    "psm-i": `Generate one PSM I® (Professional Scrum Master I)-style ${difficulty.toLowerCase()} question for "${domain}" practice.

This is for the scrum.org PSM I assessment. Questions are based on the Scrum Guide™ and focus on deep understanding of Scrum theory, empiricism, and the Scrum Master's role.

Requirements:
- Scenario-based requiring understanding of Scrum theory, roles, events, and artifacts
- 4 options with one correct answer
- Emphasize: empiricism (transparency, inspection, adaptation), Scrum values, Definition of Done
- Questions may be more nuanced than CSM — test true understanding, not just memorization
- Include concise explanation covering rationale and referencing Scrum Guide concepts
- Include why each of the 4 options is right or wrong
- Include a PSM I mindset tip
- Include a short topic label
- Avoid trick wording

Return ONLY valid JSON with fields: question, options, correctAnswer, explanation, whyOthersWrong, mindsetTip, domain, topic, difficulty`,

    "six-sigma": `Generate one Six Sigma ${difficulty.toLowerCase()} question for "${domain}" practice.

This is for Six Sigma Green Belt / Black Belt certification exam preparation covering DMAIC, Lean, and process improvement methodologies.

Requirements:
- Scenario-based in manufacturing, service, or transaction process context
- 4 options with one correct answer
- Cover: DMAIC phases, statistical process control (SPC), process mapping (SIPOC, value stream), Lean principles (waste reduction, pull, flow), measurement systems analysis (MSA), capability analysis
- Include concise explanation covering the rationale
- Include why each of the 4 options is right or wrong
- Include a Six Sigma mindset tip
- Include a short topic label
- Use correct Six Sigma terminology (CTQ, DPMO, sigma level, etc.)

Return ONLY valid JSON with fields: question, options, correctAnswer, explanation, whyOthersWrong, mindsetTip, domain, topic, difficulty`,
  };

  return (
    promptTemplates[certSlug] ??
    promptTemplates.pmp
  );
}

// ── JSON parsing ──

function parseQuestionJson(responseText: string) {
  const cleanedText = responseText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleanedText);
}

// ── Route handler ──

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain") ?? "Mixed";
    const difficulty = searchParams.get("difficulty") ?? "Mixed";
    const certSlug = (searchParams.get("cert") ?? "pmp") as CertSlug;

    const fallback = fallbackByCert[certSlug] ?? pmbFallback;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        ...fallback,
        warning: "OPENAI_API_KEY is not configured. Returned fallback question.",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = buildSystemPrompt(certSlug, domain, difficulty);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content || "";

    const questionData = parseQuestionJson(responseText);

    return NextResponse.json({
      ...questionData,
      source: "openai",
    });
  } catch (error) {
    console.error(error);

    const certSlug = (new URL(request.url).searchParams.get("cert") ?? "pmp") as CertSlug;
    const fallback = fallbackByCert[certSlug] ?? pmbFallback;

    return NextResponse.json({
      ...fallback,
      warning: "OpenAI question generation failed. Returned fallback question instead.",
    });
  }
}
