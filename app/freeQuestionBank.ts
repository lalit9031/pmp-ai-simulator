import { learningTopics } from "./learningTopics";

type FreeQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  whyOthersWrong: string[];
  mindsetTip: string;
  domain: string;
  topic: string;
  difficulty: string;
  source: string;
};

const topicScenarios = {
  agile: [
    "testing keeps slipping to the end of the sprint",
    "the product owner is unavailable for backlog decisions",
    "stakeholders are asking developers for urgent work directly",
    "the team is missing sprint goals because of support interruptions",
    "a senior developer is becoming a review bottleneck",
    "the team wants to skip the definition of done to meet a date",
    "a retrospective reveals the same quality issue every iteration",
    "the customer wants daily status meetings due to low trust",
    "the team cannot agree on how to split large stories",
    "velocity is dropping after frequent unplanned requests",
  ],
  risk: [
    "a vendor delivery may miss a milestone",
    "a regulatory dependency could affect release approval",
    "a key expert may be unavailable during testing",
    "new technology could reduce cost but adds uncertainty",
    "a weather event may affect a site deployment",
    "a supplier quality trend could create rework",
    "a security review may take longer than planned",
    "a funding decision may be delayed next month",
    "an integration risk could affect user acceptance",
    "a licensing constraint may affect the planned launch",
  ],
  stakeholder: [
    "an influential stakeholder rarely attends reviews",
    "a stakeholder says they were not informed despite email updates",
    "a customer rejects work because of an unstated assumption",
    "a department head bypasses the agreed intake process",
    "two stakeholder groups disagree about priority",
    "a sponsor requests a feature that may affect a deadline",
    "a user group gives late feedback after sign-off",
    "a stakeholder is resistant to a process change",
    "a remote team misunderstands decision outcomes",
    "a business owner wants more transparency into progress",
  ],
  hybrid: [
    "agile teams need backlog flexibility while compliance needs stable evidence",
    "a predictive workstream reports green but agile teams cannot use its outputs",
    "a new compliance requirement appears halfway through a release",
    "finance requires monthly forecasts from an agile delivery team",
    "fixed-date training depends on adaptive product increments",
    "hardware delivery follows a predictive plan while software iterates",
    "a regulatory gate conflicts with sprint review feedback",
    "a contract milestone needs stable scope while users request changes",
    "integration testing depends on both waterfall and agile deliverables",
    "governance reports do not reflect real agile delivery risks",
  ],
  ai: [
    "the team wants to use an AI tool to summarize stakeholder feedback",
    "a sponsor asks for an AI-generated forecast without source validation",
    "an AI recommendation conflicts with expert judgment from the project team",
    "project data may contain confidential customer information before AI use",
    "the team wants to automate risk classification with an AI assistant",
    "a vendor proposes an AI tool but cannot explain how data is protected",
    "the project manager notices biased outputs in AI-assisted prioritization",
    "stakeholders rely on an AI dashboard without understanding assumptions",
    "an AI tool suggests scope changes that affect regulatory commitments",
    "the team needs governance for AI prompts, outputs, and human review",
  ],
  sustainability: [
    "a delivery option reduces cost but increases environmental impact",
    "a stakeholder asks how ESG goals are reflected in project decisions",
    "a supplier has weak labor practices that could affect social value",
    "the team can reduce waste by changing packaging and logistics",
    "community impact concerns emerge during implementation planning",
    "a sustainable material increases short-term cost but reduces lifecycle cost",
    "project benefits conflict with an organizational carbon target",
    "the sponsor wants sustainability metrics included in status reporting",
    "a vendor selection decision needs environmental and social criteria",
    "a project change may affect accessibility and inclusion outcomes",
  ],
  value: [
    "the project is delivering outputs but business benefits are unclear",
    "a feature is on schedule but no longer aligns with strategy",
    "the sponsor asks how the project contributes to organizational value",
    "benefits ownership is missing after handoff to operations",
    "the team wants to prioritize low-value work because it is easy",
    "market conditions change and the original business case is outdated",
    "a release metric tracks activity but not realized outcomes",
    "the portfolio board asks whether funding should continue",
    "stakeholders disagree about which benefits matter most",
    "the product is complete but adoption is lower than expected",
  ],
} as const;

const topicTemplates = {
  agile: {
    correct: [
      "Facilitate a team discussion to inspect the issue and agree on an improvement",
      "Help the team make the work visible and adapt the workflow",
      "Work with the product owner and team to clarify priority and impact",
      "Remove the impediment while preserving team ownership",
    ],
    wrong: [
      "Escalate immediately to the sponsor for a decision",
      "Tell the team exactly how to complete the work",
      "Skip quality checks to protect the schedule",
      "Move all unfinished work forward without discussion",
    ],
    explanation:
      "Agile PMP logic favors servant leadership, transparency, team inspection, product owner involvement, and continuous improvement before escalation or command-and-control action.",
    mindset:
      "Facilitate, make work visible, protect quality, and let the right agile role make the right decision.",
  },
  risk: {
    correct: [
      "Record the risk, analyze impact and probability, and assign a response owner",
      "Review triggers and response options with the team and stakeholders",
      "Assess the risk exposure before changing scope, schedule, or budget",
      "Create or update a response plan and monitor the risk",
    ],
    wrong: [
      "Wait until the risk becomes an issue",
      "Escalate every risk to the sponsor immediately",
      "Cut scope before analyzing the impact",
      "Ignore the risk because it has not occurred yet",
    ],
    explanation:
      "Risk questions reward proactive analysis and ownership. The project manager should understand probability, impact, triggers, and response options before taking drastic action.",
    mindset:
      "Treat uncertainty early: identify, analyze, assign ownership, plan responses, and monitor triggers.",
  },
  stakeholder: {
    correct: [
      "Review stakeholder needs and adapt the engagement approach",
      "Facilitate alignment and clarify expectations with the affected stakeholders",
      "Confirm the communication approach is understood and effective",
      "Engage the stakeholder respectfully while reinforcing the agreed process",
    ],
    wrong: [
      "Remove the stakeholder from future discussions",
      "Resend the same status report without checking understanding",
      "Accept the request immediately without impact analysis",
      "Ask the sponsor to handle the stakeholder first",
    ],
    explanation:
      "Stakeholder questions test engagement, trust, communication effectiveness, and expectation management. The best answer usually improves involvement before blaming or escalating.",
    mindset:
      "Communication is measured by shared understanding, not by sending information.",
  },
  hybrid: {
    correct: [
      "Facilitate alignment on constraints, delivery approach, and change handling",
      "Hold an integration review to expose dependencies and usable outcomes",
      "Assess impact with the right roles and reprioritize through governance",
      "Tailor governance so adaptive and predictive work can coordinate",
    ],
    wrong: [
      "Force every team to use the same lifecycle immediately",
      "Freeze all changes until the project ends",
      "Ignore compliance needs until the final release",
      "Let each workstream make decisions independently",
    ],
    explanation:
      "Hybrid PMP logic rewards tailoring. The project manager should align teams on constraints, change rules, integration points, and decision rights instead of forcing one delivery method.",
    mindset:
      "Make fixed constraints and adaptive learning coexist through clear governance.",
  },
  ai: {
    correct: [
      "Validate the AI output with human expertise and documented assumptions",
      "Confirm data privacy, ethical use, and governance before using the tool",
      "Use AI as decision support while keeping accountable human decision-making",
      "Review bias, transparency, and risk before acting on the recommendation",
    ],
    wrong: [
      "Accept the AI recommendation because it is faster",
      "Enter all project data into the AI tool immediately",
      "Let the AI tool make the final project decision",
      "Ignore expert concerns because the tool is automated",
    ],
    explanation:
      "AI questions reward ethical, transparent, human-accountable use of AI. The project manager should protect data, validate outputs, check bias, and use AI as decision support rather than replacing judgment.",
    mindset:
      "AI assists the project manager; it does not remove accountability, ethics, privacy, or human review.",
  },
  sustainability: {
    correct: [
      "Evaluate environmental, social, cost, risk, and value impacts with stakeholders",
      "Include ESG goals and lifecycle impacts in the decision criteria",
      "Assess sustainability tradeoffs before changing scope or vendor choices",
      "Engage affected stakeholders and align the option with organizational goals",
    ],
    wrong: [
      "Ignore sustainability because schedule is the only success measure",
      "Choose the lowest-cost option without impact analysis",
      "Defer all ESG concerns until project closure",
      "Remove affected stakeholders from the decision",
    ],
    explanation:
      "Sustainability questions test whether project decisions consider environmental impact, social responsibility, governance, lifecycle value, and stakeholder outcomes alongside traditional constraints.",
    mindset:
      "Balance delivery with environmental and social responsibility, using measurable ESG criteria and stakeholder engagement.",
  },
  value: {
    correct: [
      "Reassess alignment with strategy, benefits, and measurable business value",
      "Work with the sponsor and product owner to prioritize value outcomes",
      "Review the business case and adapt the plan based on expected benefits",
      "Connect delivery metrics to adoption, benefits realization, and strategy",
    ],
    wrong: [
      "Continue the original plan because outputs are on schedule",
      "Prioritize the easiest work even if value is low",
      "Track only activity metrics and ignore business outcomes",
      "Wait until closure to discuss benefits",
    ],
    explanation:
      "Modern PMP questions increasingly test value delivery. The project manager should align work with strategy, benefits realization, and outcomes instead of treating scope completion as the only goal.",
    mindset:
      "Do not just deliver outputs. Keep checking whether the project is creating the intended business value.",
  },
} as const;

const difficultyCycle = ["Easy", "Medium", "Hard"] as const;

function rotateOptions(correct: string, wrong: readonly string[], seed: number) {
  const options = [correct, wrong[seed % wrong.length], wrong[(seed + 1) % wrong.length], wrong[(seed + 2) % wrong.length]];
  const shift = seed % 4;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];

  return {
    options: rotated,
    correctAnswer: rotated.indexOf(correct),
  };
}

export function buildFreeTopicQuestions(topicSlug: string): FreeQuestion[] {
  const topic = learningTopics[topicSlug];
  const scenarios =
    topicScenarios[topicSlug as keyof typeof topicScenarios] ??
    topicScenarios.agile;
  const template =
    topicTemplates[topicSlug as keyof typeof topicTemplates] ??
    topicTemplates.agile;

  return Array.from({ length: 150 }, (_, index) => {
    const scenario = scenarios[index % scenarios.length];
    const correct = template.correct[index % template.correct.length];
    const { options, correctAnswer } = rotateOptions(
      correct,
      template.wrong,
      index,
    );
    const questionNumber = index + 1;

    return {
      question: `During a PMP-style project scenario, ${scenario}. What should the project manager do first?`,
      options,
      correctAnswer,
      explanation: template.explanation,
      whyOthersWrong: options.map((option) =>
        option === correct
          ? "This is the best answer because it uses the PMP mindset for this topic before taking a drastic or unilateral action."
          : "This is weaker because it is premature, reactive, overly forceful, or skips the analysis and collaboration expected in PMP questions.",
      ),
      mindsetTip: template.mindset,
      domain: topic?.domain ?? "Agile",
      topic: topic?.title ?? "Agile Team Facilitation",
      difficulty: difficultyCycle[index % difficultyCycle.length],
      source: "free-topic-bank",
    };
  });
}

export function buildFixedPracticeQuestions(
  count = 1000,
  allowedSlugs = Object.keys(learningTopics),
): FreeQuestion[] {
  const slugs = allowedSlugs.length ? allowedSlugs : Object.keys(learningTopics);

  return Array.from({ length: count }, (_, index) => {
    const topicSlug = slugs[index % slugs.length];
    const topicQuestions = buildFreeTopicQuestions(topicSlug);
    const baseQuestion = topicQuestions[Math.floor(index / slugs.length) % topicQuestions.length];

    return {
      ...baseQuestion,
      question: baseQuestion.question,
      source: "fixed-1000-bank",
    };
  });
}

export function buildRandomFixedPracticeSet(
  count: number,
  allowedSlugs = Object.keys(learningTopics),
) {
  const bank = buildFixedPracticeQuestions(1000, allowedSlugs);
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
