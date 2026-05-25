export type PracticeQuestion = {
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type LearningTopic = {
  slug: string;
  title: string;
  domain: string;
  summary: string;
  mindset: string;
  coreIdeas: string[];
  howToThink: string[];
  examples: string[];
  focusAreas: string[];
  commonTraps: string[];
  practicePrompt: string;
  practiceSet: PracticeQuestion[];
};

export const learningTopics: Record<string, LearningTopic> = {
  agile: {
    slug: "agile",
    title: "Agile Team Facilitation",
    domain: "Agile",
    summary:
      "Agile PMP questions usually test whether the project manager can create the conditions for the team to deliver value, inspect progress, and adapt without command-and-control behavior. The best answer often protects transparency, team ownership, product owner decision rights, and continuous improvement.",
    mindset:
      "Think like a servant leader. Help the team see the problem, involve the right role, remove impediments, and improve the system. Avoid answers that tell the team exactly what to do, skip quality, hide problems, or bypass the product owner.",
    coreIdeas: [
      "The product owner prioritizes value; the project manager helps the process work.",
      "The team owns how work is done and should inspect issues together.",
      "Retrospectives are for process improvement, not blame.",
      "Definition of done and acceptance criteria protect quality and clarity.",
      "Transparency is better than optimistic reporting.",
    ],
    howToThink: [
      "First clarify the problem with the team and product owner.",
      "Look for collaboration, facilitation, and inspection before escalation.",
      "Protect quality and sustainable pace even when schedule pressure appears.",
      "Use agile events to create transparency instead of adding heavy reporting.",
      "Remove impediments rather than taking over the team's work.",
    ],
    examples: [
      "If testing is rushed every sprint, the best answer is to help the team inspect root causes and improve the workflow, not ask QA to test after the sprint.",
      "If a stakeholder pushes developers directly, reinforce the backlog intake process and product owner role while keeping stakeholder engagement respectful.",
      "If the product owner is unavailable, restore decision flow with stakeholders instead of making product decisions yourself.",
    ],
    focusAreas: [
      "Sprint reviews and retrospectives",
      "Product owner decision flow",
      "Definition of done and quality ownership",
      "Team self-organization",
      "Impediment removal",
    ],
    commonTraps: [
      "Escalating before the team has inspected the issue.",
      "Assigning tasks directly to team members in a self-organizing team.",
      "Skipping quality checks to meet a sprint or release goal.",
      "Treating agile as no planning or no forecasting.",
    ],
    practicePrompt:
      "When an agile answer mentions escalation, forced overtime, or skipping quality, look for the collaborative option that helps the team inspect and adapt.",
    practiceSet: [
      {
        prompt:
          "A team misses sprint goals because urgent support work interrupts them daily. What should the project manager do first?",
        options: [
          "Ask the team to work extra hours until the backlog is stable",
          "Make interruptions visible and facilitate a capacity discussion",
          "Tell stakeholders support requests are no longer accepted",
          "Move all unfinished work automatically to the next sprint",
        ],
        correctAnswer: 1,
        explanation:
          "The best first action is to make the work visible and help the team adapt capacity and policy. It addresses the system, not the symptom.",
      },
      {
        prompt:
          "The product owner is unavailable and backlog decisions are delayed. What is the best response?",
        options: [
          "Let the project manager prioritize the backlog",
          "Ask developers to choose the easiest items",
          "Work with stakeholders to restore timely product ownership",
          "Pause all team work until the product owner returns",
        ],
        correctAnswer: 2,
        explanation:
          "The project manager should remove the decision-flow impediment while respecting product ownership.",
      },
    ],
  },
  risk: {
    slug: "risk",
    title: "Risk Response Thinking",
    domain: "Risk",
    summary:
      "Risk questions test whether you act before uncertainty becomes an issue. PMP logic expects the project manager to identify risk, analyze probability and impact, assign ownership, plan responses, and monitor triggers. Strong answers are proactive and proportionate.",
    mindset:
      "Do not wait for the risk to happen. Do not escalate every risk. Do not change scope or budget before impact is understood. Make uncertainty visible, involve the right people, and manage it through a response plan.",
    coreIdeas: [
      "A risk is uncertain; an issue has already happened.",
      "Risk responses should have owners.",
      "Threats and opportunities both need evaluation.",
      "Impact analysis comes before major action.",
      "Risk management is continuous, not a one-time planning step.",
    ],
    howToThink: [
      "Ask whether the event has happened yet. If not, treat it as risk.",
      "Record and analyze before reacting dramatically.",
      "Choose response actions based on impact, urgency, and ownership.",
      "Communicate material risks without dumping every risk on the sponsor.",
      "Use contingency or mitigation plans when triggers appear.",
    ],
    examples: [
      "If a vendor dependency may delay a milestone, inspect options and response ownership before escalating.",
      "If an automation opportunity reduces long-term cost but adds short-term work, assess benefits, risks, and priority.",
      "If a risk could affect a milestone in six weeks, record it, analyze it, assign an owner, and plan a response.",
    ],
    focusAreas: [
      "Risk identification",
      "Qualitative impact assessment",
      "Response ownership",
      "Opportunity and threat handling",
      "Monitoring triggers",
    ],
    commonTraps: [
      "Waiting until the risk becomes an issue.",
      "Escalating all risks to the sponsor.",
      "Approving overtime or scope cuts before impact analysis.",
      "Ignoring opportunities because they were not in the original plan.",
    ],
    practicePrompt:
      "In risk questions, the best first action usually clarifies impact and ownership before changing scope, schedule, or budget.",
    practiceSet: [
      {
        prompt:
          "A supplier may miss a delivery needed for a milestone next month. What should the project manager do first?",
        options: [
          "Escalate immediately to the steering committee",
          "Analyze impact, identify response options, and assign ownership",
          "Remove the milestone from the schedule",
          "Wait until the supplier confirms the delay",
        ],
        correctAnswer: 1,
        explanation:
          "This is a risk, not yet an issue. The best response is proactive analysis and ownership.",
      },
      {
        prompt:
          "The team finds an opportunity to reduce operating cost with extra work now. What should happen?",
        options: [
          "Reject it because it changes the baseline",
          "Approve it because cost savings are always good",
          "Assess value, risk, and priority with stakeholders",
          "Ask the team to do it without updating plans",
        ],
        correctAnswer: 2,
        explanation:
          "Opportunities are managed like other uncertain events: assess value, risk, and priority before action.",
      },
    ],
  },
  stakeholder: {
    slug: "stakeholder",
    title: "Stakeholder Engagement",
    domain: "Stakeholder",
    summary:
      "Stakeholder questions test whether the project manager can build trust, surface expectations early, and adapt communication to the audience. PMP logic favors engagement, understanding, and collaboration over blame, avoidance, or one-way broadcasting.",
    mindset:
      "Communication is not just sending information. The project manager checks understanding, adapts engagement, and keeps stakeholders involved at the right time. Strong answers preserve relationships while reinforcing process.",
    coreIdeas: [
      "Stakeholders have different power, interest, needs, and expectations.",
      "Late feedback often means engagement was not effective enough.",
      "The communication plan should be adapted when it is not working.",
      "Influential stakeholders need timely participation, not end-stage surprises.",
      "Conflicts should be facilitated before they become escalations.",
    ],
    howToThink: [
      "Identify who needs to be engaged and why.",
      "Check whether the issue is understanding, expectation, influence, or timing.",
      "Prefer direct, respectful engagement before escalation.",
      "Update engagement and communication approaches when they fail.",
      "Keep governance clear while still listening to stakeholder concerns.",
    ],
    examples: [
      "If a stakeholder says they were not informed, review communication needs rather than simply resending notes.",
      "If a powerful stakeholder rarely attends reviews, adapt the engagement plan and secure timely feedback.",
      "If a stakeholder bypasses the product owner, clarify intake and decision rights without attacking the stakeholder.",
    ],
    focusAreas: [
      "Stakeholder engagement planning",
      "Communication effectiveness",
      "Expectation management",
      "Influence and participation timing",
      "Conflict facilitation",
    ],
    commonTraps: [
      "Assuming sent messages equal understood messages.",
      "Removing difficult stakeholders from decisions.",
      "Escalating before attempting direct engagement.",
      "Accepting all stakeholder requests without impact analysis.",
    ],
    practicePrompt:
      "When stakeholders are surprised or bypassing process, prefer clarifying engagement and communication paths before blaming or excluding them.",
    practiceSet: [
      {
        prompt:
          "A stakeholder rejects an increment because it does not match an assumption they never stated. What should the project manager do?",
        options: [
          "Tell the stakeholder the increment must be accepted",
          "Facilitate clarification of acceptance criteria and evaluate the change",
          "Ask the team to rework it immediately",
          "Remove the stakeholder from reviews",
        ],
        correctAnswer: 1,
        explanation:
          "The best answer preserves engagement, clarifies expectations, and handles new needs through the right change/prioritization path.",
      },
      {
        prompt:
          "A stakeholder claims they were not informed although updates were emailed weekly. What should the project manager do first?",
        options: [
          "Send the updates again",
          "Ask the sponsor to defend the project team",
          "Review communication needs and adjust the engagement approach",
          "Stop including the stakeholder in decisions",
        ],
        correctAnswer: 2,
        explanation:
          "Effective communication means the message is understood and useful. The plan should change if it is not working.",
      },
    ],
  },
  hybrid: {
    slug: "hybrid",
    title: "Hybrid Delivery Governance",
    domain: "Hybrid",
    summary:
      "Hybrid questions test whether the project manager can tailor delivery when adaptive teams and predictive constraints coexist. The best answer usually aligns decision rights, change handling, integration points, compliance needs, and communication cadences.",
    mindset:
      "Do not force every team into one delivery method. Do not freeze all change just because compliance exists. Tailor governance so adaptive learning and fixed constraints can coexist with clear rules.",
    coreIdeas: [
      "Hybrid does not mean chaos; it means fit-for-purpose governance.",
      "Compliance constraints should be visible and integrated early.",
      "Agile teams still need alignment with fixed dates and external dependencies.",
      "Predictive workstreams still need feedback on usability and integration.",
      "Change handling must be explicit so teams know what can adapt and what is fixed.",
    ],
    howToThink: [
      "Identify which parts are flexible and which are constrained.",
      "Facilitate alignment across workstreams before changing the method.",
      "Use impact analysis before accepting or rejecting new requests.",
      "Create integration reviews when outputs are not usable across teams.",
      "Preserve agile learning while meeting governance obligations.",
    ],
    examples: [
      "If agile teams and compliance teams disagree about changes, facilitate agreement on delivery approach, constraints, and change handling.",
      "If a predictive workstream reports green but agile teams cannot use the outputs, run an integration review.",
      "If a new compliance requirement appears mid-release, assess impact and reprioritize with the product owner and team.",
    ],
    focusAreas: [
      "Change handling across delivery methods",
      "Compliance and adaptive planning",
      "Workstream integration",
      "Governance without unnecessary overhead",
      "Decision rights across teams",
    ],
    commonTraps: [
      "Converting the entire project to one method immediately.",
      "Freezing the backlog without assessing value or impact.",
      "Ignoring compliance until the end.",
      "Reporting green status while integration outcomes are failing.",
    ],
    practicePrompt:
      "In hybrid questions, look for the answer that aligns teams on constraints and change rules before freezing scope or rewriting the whole approach.",
    practiceSet: [
      {
        prompt:
          "An agile team wants frequent backlog changes, but a compliance workstream needs stable deliverables. What should the project manager do first?",
        options: [
          "Force the full project to use a predictive lifecycle",
          "Freeze all backlog changes",
          "Facilitate alignment on constraints and change handling",
          "Escalate the disagreement immediately",
        ],
        correctAnswer: 2,
        explanation:
          "Hybrid governance starts by making constraints and change rules explicit across workstreams.",
      },
      {
        prompt:
          "A predictive workstream is green, but agile teams say its outputs are unusable. What is the best first action?",
        options: [
          "Report the predictive team as red",
          "Facilitate an integration review between workstreams",
          "Tell agile teams to accept the outputs",
          "Convert the predictive workstream to agile",
        ],
        correctAnswer: 1,
        explanation:
          "The problem is integration and usability. Facilitation creates shared understanding before method changes or escalation.",
      },
    ],
  },
  ai: {
    slug: "ai",
    title: "Ethical AI In Project Management",
    domain: "AI Ethics",
    summary:
      "New PMP-style questions increasingly test how project managers use AI responsibly in project tools, reporting, forecasting, risk analysis, and decision support. The best answer keeps humans accountable, protects confidential data, validates AI outputs, checks assumptions, and avoids treating an AI recommendation as an automatic decision.",
    mindset:
      "Use AI as an assistant, not as the accountable decision maker. Before acting on an AI output, confirm data permissions, review assumptions, check bias or hallucination risk, and involve the right expert or stakeholder.",
    coreIdeas: [
      "AI-assisted decisions still require human accountability.",
      "Confidential, personal, customer, and regulated data need governance before AI use.",
      "AI forecasts and recommendations should be validated against project facts.",
      "Bias, explainability, and auditability matter when AI affects people or priorities.",
      "The project manager should define how prompts, outputs, and approvals are handled.",
      "AI can support risk identification, lessons learned, estimation, and summaries when controls are clear.",
    ],
    howToThink: [
      "Ask what data is being used and whether it is approved for the AI tool.",
      "Treat AI output as evidence to review, not a final answer.",
      "Validate recommendations with experts, stakeholders, and project records.",
      "Document assumptions when AI affects forecasts, risks, or decisions.",
      "Escalate only after ethical, privacy, or governance concerns are clarified.",
    ],
    examples: [
      "If an AI tool recommends reprioritizing work, validate the assumptions with the product owner and team before changing the backlog.",
      "If stakeholder notes include confidential information, confirm data handling rules before using an AI summarizer.",
      "If an AI forecast conflicts with team evidence, review inputs and assumptions rather than accepting the forecast blindly.",
    ],
    focusAreas: [
      "Ethical AI use in project tools",
      "AI-assisted decision making",
      "Data privacy and confidentiality",
      "Bias, transparency, and explainability",
      "Human review and accountability",
      "AI governance for prompts, outputs, and approvals",
    ],
    commonTraps: [
      "Letting AI make the final decision.",
      "Uploading sensitive project data without checking policy.",
      "Using AI output without validating assumptions.",
      "Ignoring bias or explainability because the tool is fast.",
    ],
    practicePrompt:
      "When AI appears in an answer choice, look for privacy, validation, transparency, and human accountability before speed or automation.",
    practiceSet: [
      {
        prompt:
          "An AI tool recommends removing several risks from the risk register because they appear unlikely. What should the project manager do first?",
        options: [
          "Accept the recommendation because the tool analyzed the data",
          "Validate the assumptions with the team and risk owners",
          "Disable AI for all future project work",
          "Delete the risks and notify stakeholders later",
        ],
        correctAnswer: 1,
        explanation:
          "AI can support analysis, but risk decisions still need human review, assumptions checking, and accountable ownership.",
      },
      {
        prompt:
          "A team wants to use an AI summarizer for customer interviews that include confidential details. What is the best response?",
        options: [
          "Use the tool immediately to save time",
          "Confirm data privacy rules and approved tool usage first",
          "Ask the AI tool to delete the data after use",
          "Send the raw transcripts to the full project team",
        ],
        correctAnswer: 1,
        explanation:
          "The project manager should verify privacy, confidentiality, and tool governance before using sensitive data with AI.",
      },
    ],
  },
  sustainability: {
    slug: "sustainability",
    title: "Sustainability And ESG Decisions",
    domain: "Sustainability",
    summary:
      "Updated PMP practice should include environmental and social sustainability, including ESG goals, lifecycle impacts, supplier responsibility, inclusion, community impact, and benefits beyond short-term cost or schedule. The best answer balances project constraints with responsible value delivery.",
    mindset:
      "Do not treat sustainability as decoration or a closure activity. Include environmental and social impacts in decision criteria, engage affected stakeholders, and connect tradeoffs to organizational strategy and benefits.",
    coreIdeas: [
      "ESG goals can influence scope, procurement, risk, benefits, and stakeholder engagement.",
      "Lifecycle cost may be more important than lowest purchase cost.",
      "Environmental impact includes waste, emissions, energy, materials, and operations.",
      "Social sustainability includes community impact, accessibility, inclusion, labor practices, and safety.",
      "Sustainability decisions should be measurable and aligned with strategy.",
      "Tradeoffs should be assessed before changing scope, vendors, or acceptance criteria.",
    ],
    howToThink: [
      "Identify environmental and social impacts affected by the decision.",
      "Bring ESG criteria into options analysis instead of ignoring them.",
      "Engage stakeholders who are affected by sustainability outcomes.",
      "Use lifecycle value, not just immediate cost, when comparing options.",
      "Document tradeoffs and align them with organizational goals.",
    ],
    examples: [
      "If a cheaper supplier has poor labor practices, evaluate social risk and procurement criteria before selecting them.",
      "If a sustainable material costs more now but lowers operating cost, assess lifecycle value with the sponsor.",
      "If a project change affects accessibility, involve affected users and update acceptance criteria.",
    ],
    focusAreas: [
      "Environmental sustainability",
      "Social sustainability",
      "ESG goals and measures",
      "Supplier and procurement responsibility",
      "Lifecycle value and benefits",
      "Community, inclusion, safety, and accessibility impacts",
    ],
    commonTraps: [
      "Choosing the cheapest option without ESG analysis.",
      "Ignoring community or social impact until after delivery.",
      "Treating sustainability as outside the project manager role.",
      "Reporting only schedule and budget when benefits include ESG outcomes.",
    ],
    practicePrompt:
      "For sustainability questions, the strongest answer evaluates ESG impact, lifecycle value, stakeholders, and strategy before choosing the fastest or cheapest path.",
    practiceSet: [
      {
        prompt:
          "A lower-cost vendor may miss the organization's social responsibility standards. What should the project manager do?",
        options: [
          "Select the vendor because budget is most important",
          "Assess social, procurement, risk, and value impacts with stakeholders",
          "Ignore the concern until contract closure",
          "Remove sustainability criteria from vendor scoring",
        ],
        correctAnswer: 1,
        explanation:
          "Vendor choices should consider social responsibility, risk, value, and organizational standards, not only immediate cost.",
      },
      {
        prompt:
          "A design option reduces waste but increases short-term cost. What should happen first?",
        options: [
          "Reject it because it increases cost",
          "Approve it without analysis because sustainability is always required",
          "Evaluate lifecycle value, ESG goals, and stakeholder priorities",
          "Hide the option until the project is complete",
        ],
        correctAnswer: 2,
        explanation:
          "The project manager should compare lifecycle value and strategic sustainability goals before approving or rejecting the option.",
      },
    ],
  },
  value: {
    slug: "value",
    title: "Strategy, Value, And Benefits Realization",
    domain: "Business Environment",
    summary:
      "The updated exam places more weight on the business environment, strategic alignment, and value realization. Questions now care less about delivering outputs alone and more about whether the project produces measurable benefits that support organizational strategy.",
    mindset:
      "Think beyond scope completion. A project can be on time and still fail if it does not create value. Keep checking the business case, benefits, adoption, strategy, and whether the work should be reprioritized.",
    coreIdeas: [
      "Projects exist to deliver business value, not just outputs.",
      "Benefits should have owners, measures, timing, and transition plans.",
      "Strategy changes may require reprioritization or business case review.",
      "Value can include financial, customer, compliance, ESG, risk reduction, and capability benefits.",
      "Adoption and operational readiness affect whether benefits are realized.",
      "Metrics should track outcomes, not only activity or task completion.",
    ],
    howToThink: [
      "Ask whether the work still supports strategy and expected benefits.",
      "Use value and benefits to guide prioritization decisions.",
      "Review the business case when conditions change.",
      "Plan the transition to operations so benefits can be realized.",
      "Prefer outcome measures over task-completion measures.",
    ],
    examples: [
      "If a feature is on schedule but no longer supports strategy, reassess priority with the sponsor and product owner.",
      "If the product is delivered but adoption is low, inspect benefits realization and transition planning.",
      "If market conditions change, review the business case before continuing the original plan unchanged.",
    ],
    focusAreas: [
      "Strategic alignment",
      "Business value realization",
      "Benefits ownership and measurement",
      "Portfolio and funding decisions",
      "Operational transition and adoption",
      "Outcome-based metrics",
    ],
    commonTraps: [
      "Continuing low-value work because it was in the original baseline.",
      "Measuring only schedule and budget.",
      "Waiting until closure to discuss benefits.",
      "Ignoring adoption and operational readiness.",
    ],
    practicePrompt:
      "When value appears in a question, choose the answer that connects work to strategy, measurable benefits, and outcomes before simply protecting the baseline.",
    practiceSet: [
      {
        prompt:
          "A project is on schedule, but the sponsor says market conditions have changed and expected benefits may be lower. What should the project manager do?",
        options: [
          "Continue the plan because the baseline is approved",
          "Review the business case and value assumptions with the sponsor",
          "Cancel the project immediately",
          "Ask the team to work faster",
        ],
        correctAnswer: 1,
        explanation:
          "Changed conditions require reassessing the business case and benefits before deciding how to proceed.",
      },
      {
        prompt:
          "A release is complete, but users are not adopting the new process. What should the project manager focus on?",
        options: [
          "Only closing procurement documents",
          "Benefits realization, transition support, and adoption barriers",
          "Declaring success because scope was delivered",
          "Removing adoption metrics from reporting",
        ],
        correctAnswer: 1,
        explanation:
          "Value is realized through adoption and outcomes, not just delivery of outputs.",
      },
    ],
  },
  /* ── PMI-ACP: Agile Principles ── */
  "agile-principles": {
    slug: "agile-principles",
    title: "Agile Principles & Mindset",
    domain: "Agile Principles",
    summary:
      "The PMI-ACP exam tests deep understanding of the Agile Manifesto, its 12 principles, and the agile mindset. Questions focus on how agile principles translate into team behavior, stakeholder collaboration, and delivery decisions.",
    mindset:
      "Think lean and value-driven. Individuals and interactions over processes and tools. Working software over comprehensive documentation. Customer collaboration over contract negotiation. Responding to change over following a plan.",
    coreIdeas: [
      "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.",
      "Welcome changing requirements, even late in development. Agile processes harness change for competitive advantage.",
      "Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.",
      "Business people and developers must work together daily throughout the project.",
      "Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.",
      "The most efficient and effective method of conveying information is face-to-face conversation.",
      "Working software is the primary measure of progress.",
      "Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.",
      "Continuous attention to technical excellence and good design enhances agility.",
      "Simplicity — the art of maximizing the amount of work not done — is essential.",
      "The best architectures, requirements, and designs emerge from self-organizing teams.",
      "At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.",
    ],
    howToThink: [
      "Customer value comes first — always start from what the customer needs.",
      "Change is welcome, not feared — inspect and adapt.",
      "Trust the team to self-organize and make technical decisions.",
      "Face-to-face communication is preferred over written documentation.",
      "Simplicity is essential — do the minimum needed to deliver value now.",
    ],
    examples: [
      "If a stakeholder wants detailed up-front documentation, explain that agile prefers just enough documentation and focuses on working software.",
      "If a new requirement emerges mid-iteration, welcome it but evaluate its impact on the current sprint goal.",
      "If the team is burned out, the principle of sustainable pace should guide the discussion on workload.",
    ],
    focusAreas: [
      "Agile Manifesto values and principles",
      "Customer collaboration and value delivery",
      "Self-organizing teams",
      "Sustainable pace",
      "Continuous improvement",
      "Face-to-face communication",
    ],
    commonTraps: [
      "Treating agile as just process ceremonies without the mindset.",
      "Command-and-control behavior that undermines self-organization.",
      "Over-documentation as a substitute for face-to-face communication.",
      "Ignoring technical excellence in favor of speed.",
    ],
    practicePrompt:
      "When an agile principles question appears, look for the answer that values individuals, collaboration, working software, and responding to change over rigid processes.",
    practiceSet: [
      {
        prompt:
          "A new team member asks why agile prefers face-to-face communication over detailed written specifications. What is the best explanation?",
        options: [
          "Face-to-face conversation is the most efficient and effective method of conveying information",
          "Written specifications are not allowed in agile",
          "Face-to-face communication is only for co-located teams",
          "Documentation has no value in agile projects",
        ],
        correctAnswer: 0,
        explanation:
          "The Agile Manifesto values face-to-face conversation as the most efficient and effective communication method, though documentation is still used when needed.",
      },
      {
        prompt:
          "A stakeholder says the team should commit to a fixed scope for the next six months. The team is using Scrum. What is the best response?",
        options: [
          "Agree to fix the scope to satisfy the stakeholder",
          "Explain that agile welcomes changing requirements and uses iterative planning",
          "Create a detailed six-month plan with fixed scope",
          "Ask the team to work overtime to meet the fixed scope",
        ],
        correctAnswer: 1,
        explanation:
          "Agile embraces change. Fixed long-term scope contradicts the principle of welcoming changing requirements and iterative delivery.",
      },
    ],
  },
  "value-driven-delivery": {
    slug: "value-driven-delivery",
    title: "Value-Driven Delivery",
    domain: "Value-Driven Delivery",
    summary:
      "Value-driven delivery is a core agile principle where the team prioritizes delivering the highest-value features first. Techniques include prioritization frameworks (MoSCoW, Kano, relative weighting), minimum viable product (MVP), and regular value delivery through short iterations.",
    mindset:
      "Every feature should be evaluated by the value it delivers to the customer. Deliver the smallest increment that provides value, gather feedback, and iterate. Maximize value delivered per unit of time.",
    coreIdeas: [
      "Prioritize backlog items by value, not by effort or dependency order.",
      "MoSCoW: Must have, Should have, Could have, Won't have.",
      "Kano Model: basic needs, performance needs, excitement needs.",
      "MVP delivers enough value to validate assumptions with real users.",
      "Short iterations enable early value delivery and rapid feedback.",
      "Re-prioritize at each iteration boundary based on new information.",
    ],
    howToThink: [
      "What delivers the most value to the customer right now?",
      "Can we deliver a smaller version of this feature now and iterate?",
      "Use data and feedback to validate assumptions about value.",
      "Avoid gold-plating — build what is needed, not what is imagined.",
      "Defer low-value features to later iterations.",
    ],
    examples: [
      "If a team is building a payment system, deliver a single payment method first (MVP) before adding all supported methods.",
      "When prioritizing features, use MoSCoW to separate essential compliance features (Must have) from nice-to-have UI enhancements (Could have).",
    ],
    focusAreas: [
      "Backlog prioritization (MoSCoW, Kano, relative weighting)",
      "MVP and minimum marketable features",
      "Value-based delivery sequencing",
      "Early and frequent value delivery",
      "Customer feedback loops",
    ],
    commonTraps: [
      "Prioritizing by effort (easiest first) rather than value.",
      "Building more than needed before validating.",
      "Continuing to invest in low-value features after new information emerges.",
      "Treating all features as Must haves.",
    ],
    practicePrompt:
      "For value-driven delivery questions, the best answer prioritizes customer value, delivers iteratively, and re-prioritizes based on feedback.",
    practiceSet: [
      {
        prompt:
          "A team has 15 items in the backlog for a two-week sprint. The product owner ranks them by value, but the team can only complete 8 items. What should guide the selection?",
        options: [
          "Select the 8 items that the team is most familiar with",
          "Select the top 8 by value ranking and verify capacity",
          "Ask stakeholders to decide which items to drop",
          "Include all 15 items and see how far the team gets",
        ],
        correctAnswer: 1,
        explanation:
          "Value ranking by the product owner, validated against team capacity, determines what goes into the sprint. The highest-value items are selected first.",
      },
      {
        prompt:
          "A product owner suggests building a comprehensive reporting dashboard with 12 different views before releasing anything. What should the agile coach recommend?",
        options: [
          "Build all 12 views as requested to ensure completeness",
          "Release the most valuable 2-3 views first, gather feedback, and iterate",
          "Build only one view to reduce cost",
          "Delay the entire dashboard until the next release",
        ],
        correctAnswer: 1,
        explanation:
          "Value-driven delivery favors releasing the highest-value features early and iterating based on feedback rather than building everything upfront.",
      },
    ],
  },
  "stakeholder-engagement-acp": {
    slug: "stakeholder-engagement-acp",
    title: "Stakeholder Engagement (Agile)",
    domain: "Stakeholder Engagement",
    summary:
      "In agile, stakeholder engagement is continuous and collaborative. The product owner acts as the voice of the customer, but the team directly engages stakeholders through reviews, demos, and ongoing feedback loops. Active stakeholder participation is critical for agile success.",
    mindset:
      "Stakeholders are partners, not just information sources. Engage them frequently, make them part of the process, and create transparency through demos and reviews. The product owner bridges stakeholder needs and team execution.",
    coreIdeas: [
      "The product owner is the single point of contact for stakeholder priorities.",
      "Sprint reviews are the primary opportunity for stakeholder feedback.",
      "Stakeholders should see working software frequently, not just reports.",
      "Feedback from stakeholders should be transparent and visible to the team.",
      "Stakeholder engagement is continuous, not event-driven.",
      "Conflicting stakeholder priorities are resolved by the product owner.",
    ],
    howToThink: [
      "Engage stakeholders early and often — do not wait for late-stage reviews.",
      "Make feedback easy and natural — demos, prototypes, and walkthroughs.",
      "When stakeholders disagree, the product owner should make the final call on priority.",
      "Keep stakeholders informed about what the team is working on and why.",
      "Use transparency to build trust — show real progress, not projections.",
    ],
    examples: [
      "If a key stakeholder misses the sprint review, the product owner should follow up individually to gather feedback.",
      "If two stakeholders have conflicting feature requests, the product owner prioritizes based on value and strategy.",
    ],
    focusAreas: [
      "Product owner as stakeholder proxy",
      "Sprint reviews for feedback",
      "Continuous stakeholder collaboration",
      "Transparency and trust-building",
      "Managing conflicting priorities",
    ],
    commonTraps: [
      "Treating stakeholder engagement as a one-time activity at project start.",
      "Letting stakeholders direct the team's daily work.",
      "Hiding problems from stakeholders until they are solved.",
      "Allowing multiple stakeholders to give conflicting direction without PO mediation.",
    ],
    practicePrompt:
      "For agile stakeholder engagement, the best answer involves continuous collaboration, the product owner as decision-maker, and frequent working software demos.",
    practiceSet: [
      {
        prompt:
          "A stakeholder emails the development team directly asking them to add a last-minute feature before the upcoming review. What is the best response?",
        options: [
          "The team should add the feature immediately to satisfy the stakeholder",
          "The team should redirect the request to the product owner for prioritization",
          "The team should ignore the request",
          "The team should add it and hide it from the product owner",
        ],
        correctAnswer: 1,
        explanation:
          "The product owner is responsible for backlog prioritization. Direct stakeholder requests should be funneled through the PO.",
      },
      {
        prompt:
          "During a sprint review, stakeholders provide unexpected negative feedback about the direction of the product. What should the team do?",
        options: [
          "Defend the work that was done",
          "Listen, capture the feedback, and discuss how to adapt the backlog with the product owner",
          "Ignore the feedback because it came too late",
          "Cancel the current sprint and start over",
        ],
        correctAnswer: 1,
        explanation:
          "Sprint reviews are for gathering feedback. Negative feedback is valuable — it should be captured and used to adapt future work.",
      },
    ],
  },
  "team-performance": {
    slug: "team-performance",
    title: "Team Performance",
    domain: "Team Performance",
    summary:
      "Agile teams are self-organizing, cross-functional, and empowered to make decisions. The agile coach or ScrumMaster facilitates team performance by removing impediments, fostering collaboration, and helping the team continuously improve. Velocity, cycle time, and team satisfaction are key measures.",
    mindset:
      "The team owns its process and performance. The facilitator helps the team inspect and adapt, not by prescribing solutions but by creating conditions for high performance. Trust, safety, and empowerment are essential.",
    coreIdeas: [
      "Self-organizing teams decide how to do their work.",
      "Cross-functional teams have all skills needed to deliver value.",
      "Impediment removal is a key facilitator function.",
      "Team velocity is a planning tool, not a performance metric.",
      "Retrospectives drive continuous team improvement.",
      "Psychological safety enables honest communication and innovation.",
    ],
    howToThink: [
      "When the team faces a problem, ask what is preventing them from performing.",
      "Remove impediments, don't solve problems for the team.",
      "Use metrics like cycle time to identify bottlenecks, not to judge individuals.",
      "Celebrate improvements and learn from failures as a team.",
      "Protect the team from external disruptions.",
    ],
    examples: [
      "If the team's velocity drops, facilitate a retrospective to identify root causes rather than demanding more output.",
      "If a team member is struggling, the team self-organizes to help, not the manager reassigning work.",
    ],
    focusAreas: [
      "Self-organizing teams",
      "Impediment removal",
      "Cross-functional collaboration",
      "Velocity and capacity management",
      "Retrospectives and continuous improvement",
      "Psychological safety",
    ],
    commonTraps: [
      "Using velocity to compare teams or evaluate individual performance.",
      "Assigning tasks to team members instead of letting them self-organize.",
      "Skipping retrospectives when the team is busy.",
      "External managers overriding the team's process decisions.",
    ],
    practicePrompt:
      "For team performance questions, the best answer empowers the team to self-organize, removes impediments, and fosters continuous improvement through retrospectives.",
    practiceSet: [
      {
        prompt:
          "A team's velocity has been declining for three consecutive sprints. The product owner is concerned. What should the agile coach do first?",
        options: [
          "Report the velocity drop to senior management",
          "Facilitate a retrospective to help the team identify root causes",
          "Add more team members to increase capacity",
          "Reduce the sprint length to improve focus",
        ],
        correctAnswer: 1,
        explanation:
          "Velocity changes should be understood by the team first. A retrospective helps the team inspect what is affecting their performance.",
      },
      {
        prompt:
          "A team member tells the ScrumMaster they are overwhelmed but does not want to bring it up in the daily standup. What is the best response?",
        options: [
          "Tell the team member to work harder",
          "Respect their privacy and discuss how to address the workload issue together",
          "Ask the product owner to reduce scope",
          "Assign some of their tasks to other team members",
        ],
        correctAnswer: 1,
        explanation:
          "The ScrumMaster should support the team member privately, respecting their concern, and collaboratively find a solution without overstepping team self-organization.",
      },
    ],
  },
  "adaptive-planning": {
    slug: "adaptive-planning",
    title: "Adaptive Planning",
    domain: "Adaptive Planning",
    summary:
      "Adaptive planning in agile means planning is continuous and multi-level: product roadmap, release plan, iteration plan, and daily plan. Plans are adjusted based on new information, feedback, and changing priorities. Rolling-wave planning and progressive elaboration are key techniques.",
    mindset:
      "Plans are valuable, but planning is even more valuable. Adapt plans as you learn more. Avoid detailed long-term plans that become obsolete quickly. Plan in horizons: near-term is detailed, far-term is high-level.",
    coreIdeas: [
      "Planning happens at multiple horizons: strategy, release, iteration, daily.",
      "Release plans are revisited at each iteration boundary.",
      "Rolling-wave planning: detail near-term work, estimate future work broadly.",
      "Velocity and capacity drive realistic planning.",
      "Plans are adjusted based on actual progress, not wishful thinking.",
      "The team should participate in estimation and planning.",
    ],
    howToThink: [
      "Plan just enough to move forward — not so much that plans become useless.",
      "Re-plan when new information changes priorities or understanding.",
      "Use historical velocity for capacity planning, not arbitrary targets.",
      "Involve the whole team in estimation and planning sessions.",
      "Keep the product roadmap visible but adaptable.",
    ],
    examples: [
      "At release planning, the team estimates the next iteration in detail and the next release at a higher level.",
      "After two sprints, the team realizes their velocity is lower than estimated. They adjust the release plan accordingly.",
    ],
    focusAreas: [
      "Multi-horizon planning (strategy, release, iteration, daily)",
      "Rolling-wave planning",
      "Estimation techniques (story points, ideal days, affinity)",
      "Release plan adjustment based on velocity",
      "Progressive elaboration",
    ],
    commonTraps: [
      "Creating detailed six-month plans that are immediately outdated.",
      "Not re-planning when new information emerges.",
      "Using velocity as a commitment rather than a forecast.",
      "Planning without team involvement or buy-in.",
    ],
    practicePrompt:
      "For adaptive planning questions, the best answer plans at multiple horizons, adjusts based on data, and involves the whole team.",
    practiceSet: [
      {
        prompt:
          "A team is starting a new project. The product owner wants a detailed schedule for the next six months. What should the agile coach recommend?",
        options: [
          "Create a detailed six-month plan as requested",
          "Create a high-level release plan with detailed plans for the next iteration only",
          "Refuse to do any planning until the team has more information",
          "Create a detailed plan but expect it to change significantly",
        ],
        correctAnswer: 1,
        explanation:
          "Adaptive planning uses rolling-wave: detailed near-term plans and high-level longer-term plans that are refined as more is learned.",
      },
      {
        prompt:
          "After three sprints, the team's actual velocity is 20% lower than planned. What should happen to the release plan?",
        options: [
          "The release plan remains unchanged because it was approved",
          "The release plan should be revisited and adjusted based on actual velocity",
          "The team should work overtime to meet the original plan",
          "Scope should be added to compensate for the velocity",
        ],
        correctAnswer: 1,
        explanation:
          "Adaptive planning uses actual data. Release plans are adjusted at iteration boundaries based on observed velocity.",
      },
    ],
  },
  /* ── CAPM: Project Fundamentals ── */
  "project-fundamentals": {
    slug: "project-fundamentals",
    title: "Project Fundamentals",
    domain: "Project Fundamentals",
    summary:
      "CAPM tests foundational knowledge of project management concepts: what a project is, the triple constraint (scope, time, cost), project lifecycle, organizational influences, and the role of the project manager. These are the building blocks of all PM processes.",
    mindset:
      "Think basics first. A project is a temporary endeavor to create a unique product, service, or result. Operations are ongoing. Every project operates within constraints that must be balanced.",
    coreIdeas: [
      "A project is temporary and unique; operations are ongoing and repetitive.",
      "The triple constraint: scope, schedule, cost. Quality is affected by all three.",
      "Projects go through phases: starting the project, organizing and preparing, carrying out the work, closing the project.",
      "Organizational structures (functional, matrix, projectized) affect PM authority.",
      "The project manager is assigned by the charter and is accountable for project success.",
      "Enterprise environmental factors and organizational process assets influence how projects are managed.",
    ],
    howToThink: [
      "Distinguish projects (temporary, unique) from operations (ongoing, repetitive).",
      "Scope, time, and cost are interrelated — changing one affects the others.",
      "The project lifecycle provides a framework for managing the project.",
      "Organizational culture and structure affect how the PM operates.",
      "The project charter authorizes the project and names the PM.",
    ],
    examples: [
      "Developing a new mobile app is a project; processing payroll each month is an operation.",
      "If the customer adds scope without adjusting time or budget, the PM should request a change request through the integrated change control process.",
    ],
    focusAreas: [
      "Project definition vs. operations",
      "Triple constraint management",
      "Project lifecycles and phases",
      "Organizational influence on projects",
      "PM role and responsibilities",
    ],
    commonTraps: [
      "Confusing projects with operations.",
      "Thinking the triple constraint is just scope, time, cost (quality is cross-cutting).",
      "Assuming all projects follow the same lifecycle.",
      "Not recognizing the charter as the PM's source of authority.",
    ],
    practicePrompt:
      "For CAPM fundamentals, identify the project characteristics and how organizational factors influence management approach.",
    practiceSet: [
      {
        prompt:
          "A company hires a project manager to lead the development of a custom software solution. The PM is told the project must be completed within six months with a budget of $500,000. What is this an example of?",
        options: [
          "Triple constraint",
          "Project charter objectives",
          "Organizational process assets",
          "Resource management plan",
        ],
        correctAnswer: 1,
        explanation:
          "The objectives of scope (custom software), time (six months), and cost ($500K) are typically defined in the project charter.",
      },
      {
        prompt:
          "Which of the following best describes a project?",
        options: [
          "A repetitive process to manufacture 10,000 units per month",
          "A temporary endeavor undertaken to create a unique product, service, or result",
          "An ongoing operational activity to support daily business functions",
          "A continuous improvement initiative with no defined end date",
        ],
        correctAnswer: 1,
        explanation:
          "By PMBOK definition, a project is a temporary endeavor with a unique output. Operations are ongoing and repetitive.",
      },
    ],
  },
  "predictive-methods": {
    slug: "predictive-methods",
    title: "Predictive Methods (Waterfall)",
    domain: "Predictive Methods",
    summary:
      "Predictive project management (also called waterfall) follows a sequential lifecycle where each phase completes before the next begins. Key concepts include the Work Breakdown Structure (WBS), critical path method, earned value management (EVM), and progressive elaboration.",
    mindset:
      "Plan the work, then work the plan. Detailed planning happens upfront. Changes are managed through formal change control. Focus on baseline management, variance analysis, and corrective actions.",
    coreIdeas: [
      "The WBS decomposes scope into manageable work packages.",
      "The critical path is the longest sequence of activities determining project duration.",
      "Earned Value Management (EVM) measures cost and schedule performance (CPI, SPI).",
      "Progressive elaboration means the project plan becomes more detailed over time.",
      "Change requests go through integrated change control.",
      "Milestones mark significant events or phase completions.",
    ],
    howToThink: [
      "Start with detailed requirements and a complete project plan.",
      "Use WBS to ensure all work is identified.",
      "Identify the critical path to understand schedule risk.",
      "Track progress using EVM metrics (planned value, earned value, actual cost).",
      "Manage changes through the defined change control process.",
    ],
    examples: [
      "A construction project follows a predictive lifecycle: design, permitting, site prep, foundation, framing, finishing.",
      "If a task on the critical path is delayed by one week, the entire project is delayed by one week.",
    ],
    focusAreas: [
      "Work Breakdown Structure (WBS)",
      "Critical path method and float",
      "Earned Value Management (EVM)",
      "Change control process",
      "Progressive elaboration",
      "Phase gates and milestones",
    ],
    commonTraps: [
      "Confusing critical path with the shortest path.",
      "Thinking project float applies to all activities.",
      "Treating EVM as the only performance indicator.",
      "Skipping change control for small changes.",
    ],
    practicePrompt:
      "For predictive method questions, look for detailed upfront planning, baseline management, sequential phases, and formal change control.",
    practiceSet: [
      {
        prompt:
          "A project has three activities on the critical path: A (10 days), B (15 days), and C (5 days). Activity D (8 days) has 5 days of float. If activity B takes 17 days, what happens to the project duration?",
        options: [
          "The project duration increases by 2 days",
          "The project duration is unaffected",
          "The critical path shifts to activity D",
          "The project duration increases by 5 days",
        ],
        correctAnswer: 0,
        explanation:
          "Any delay on the critical path directly extends the project duration. A 2-day delay in B adds 2 days to the total project.",
      },
      {
        prompt:
          "What is the primary purpose of the Work Breakdown Structure (WBS)?",
        options: [
          "To show the project schedule with start and end dates",
          "To decompose the total project scope into manageable work packages",
          "To identify project risks and assign owners",
          "To define the project budget and resource allocation",
        ],
        correctAnswer: 1,
        explanation:
          "The WBS is a deliverable-oriented decomposition of scope that helps ensure all work is identified and organized.",
      },
    ],
  },
  "agile-methods-capm": {
    slug: "agile-methods-capm",
    title: "Agile Methods (CAPM)",
    domain: "Agile Methods",
    summary:
      "The CAPM exam covers agile fundamentals including the Agile Manifesto, Scrum framework, roles, events, and artifacts. Candidates need to understand how agile differs from predictive approaches and when each is appropriate.",
    mindset:
      "Understand agile as an adaptive approach for complex projects with high uncertainty. Know the key roles, ceremonies, and artifacts of Scrum, and how agile principles guide decision-making.",
    coreIdeas: [
      "Agile is best suited for projects with high uncertainty and changing requirements.",
      "Scrum roles: Product Owner, ScrumMaster, Development Team.",
      "Scrum events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective.",
      "Scrum artifacts: Product Backlog, Sprint Backlog, Increment.",
      "Agile uses time-boxed iterations (sprints) for value delivery.",
      "The product owner manages value through backlog prioritization.",
    ],
    howToThink: [
      "Agile is iterative and incremental, not sequential.",
      "Requirements are refined throughout the project, not fully defined upfront.",
      "The team self-organizes to determine how to do the work.",
      "Customer feedback is gathered frequently through demos and reviews.",
      "Agile works best with co-located, collaborative teams.",
    ],
    examples: [
      "A software startup with evolving requirements would use agile; a bridge construction with fixed specifications would use predictive.",
      "In Scrum, the team commits to a Sprint Goal and the Sprint Backlog, not a fixed scope.",
    ],
    focusAreas: [
      "When to use agile vs. predictive",
      "Scrum framework (roles, events, artifacts)",
      "Agile Manifesto values",
      "User stories and acceptance criteria",
      "Backlog refinement",
    ],
    commonTraps: [
      "Thinking agile means no planning.",
      "Confusing the ScrumMaster role with a project manager.",
      "Treating the product owner as a project manager.",
      "Assuming agile can be used for any project type.",
    ],
    practicePrompt:
      "For CAPM agile questions, identify the correct Scrum roles, events, and artifacts, and understand when agile is appropriate.",
    practiceSet: [
      {
        prompt:
          "In the Scrum framework, who is responsible for managing the Product Backlog?",
        options: [
          "The ScrumMaster",
          "The Development Team",
          "The Product Owner",
          "The Project Manager",
        ],
        correctAnswer: 2,
        explanation:
          "The Product Owner is accountable for Product Backlog management, including prioritization and value optimization.",
      },
      {
        prompt:
          "A project has well-defined requirements and a fixed budget with regulatory compliance needs. Which development approach is most appropriate?",
        options: [
          "Agile (Scrum)",
          "Predictive (Waterfall)",
          "Hybrid",
          "Kanban",
        ],
        correctAnswer: 1,
        explanation:
          "Predictive approaches work best when requirements are clear, stable, and regulated. Agile is better for high-uncertainty projects.",
      },
    ],
  },
  "business-analysis-capm": {
    slug: "business-analysis-capm",
    title: "Business Analysis (CAPM)",
    domain: "Business Analysis",
    summary:
      "CAPM business analysis covers needs assessment, stakeholder analysis, requirements gathering, traceability, and solution evaluation. The BA role ensures the project delivers the right solution by connecting business needs to project outputs.",
    mindset:
      "Understand the business problem before defining requirements. Trace requirements from business need through solution delivery. Involve the right stakeholders to gather complete requirements.",
    coreIdeas: [
      "Needs assessment identifies the business problem or opportunity before the project starts.",
      "Stakeholder analysis identifies who has requirements or is affected by the solution.",
      "Requirements types: business, stakeholder, solution (functional and non-functional), transition.",
      "Requirements traceability matrix links requirements to business objectives and test cases.",
      "Solution evaluation validates that the delivered solution meets business needs.",
    ],
    howToThink: [
      "Start with the business need, not the solution.",
      "Engage the right stakeholders to gather comprehensive requirements.",
      "Document and trace requirements to ensure nothing is lost.",
      "Validate that the solution actually solves the business problem.",
      "Distinguish between what stakeholders want and what they need.",
    ],
    examples: [
      "Before building a new CRM system, conduct a needs assessment to confirm the current system deficiencies and expected benefits.",
      "Use a requirements traceability matrix to track each requirement from stakeholder request through design, test, and delivery.",
    ],
    focusAreas: [
      "Needs assessment",
      "Stakeholder analysis and engagement",
      "Requirements gathering and documentation",
      "Requirements traceability matrix",
      "Solution evaluation and validation",
    ],
    commonTraps: [
      "Jumping to solutions before understanding the business problem.",
      "Gathering requirements from only one stakeholder group.",
      "Not tracing requirements through the project lifecycle.",
      "Assuming the delivered solution will automatically meet business needs without validation.",
    ],
    practicePrompt:
      "For business analysis questions, start with the business need, engage stakeholders, and trace requirements through to validation.",
    practiceSet: [
      {
        prompt:
          "A project team has been asked to build a new reporting system. Before starting requirements, what should they do first?",
        options: [
          "Interview users about what reports they need",
          "Conduct a needs assessment to understand the business problem",
          "Design the database schema for the reporting system",
          "Create a project charter",
        ],
        correctAnswer: 1,
        explanation:
          "A needs assessment confirms the business problem and whether a project is justified before gathering detailed requirements.",
      },
      {
        prompt:
          "A requirement states: 'The system shall process 1,000 transactions per second.' What type of requirement is this?",
        options: [
          "Business requirement",
          "Stakeholder requirement",
          "Non-functional (solution) requirement",
          "Transition requirement",
        ],
        correctAnswer: 2,
        explanation:
          "Non-functional requirements describe system performance characteristics (capacity, speed, reliability).",
      },
    ],
  },
  /* ── CSM: Scrum Theory ── */
  "scrum-theory": {
    slug: "scrum-theory",
    title: "Scrum Theory & Empiricism",
    domain: "Scrum Theory",
    summary:
      "Scrum is founded on empirical process control theory, or empiricism. The three pillars of empiricism are transparency, inspection, and adaptation. Scrum's iterative approach, time-boxed events, and artifacts all support empirical decision-making based on observed reality rather than assumptions.",
    mindset:
      "Decisions should be based on what is known, not what is assumed. Make work visible, inspect progress frequently, and adapt the plan based on real data. The ScrumMaster protects the empirical process.",
    coreIdeas: [
      "Empiricism asserts that knowledge comes from experience and making decisions based on what is known.",
      "Transparency: significant aspects of the process must be visible to those responsible for the outcome.",
      "Inspection: Scrum users must frequently inspect Scrum artifacts and progress toward the Sprint Goal.",
      "Adaptation: if any aspect of a process deviates outside acceptable limits, the process must be adjusted.",
      "Scrum's five values: Commitment, Courage, Focus, Openness, Respect.",
    ],
    howToThink: [
      "Make work transparent — hide nothing, especially problems.",
      "Inspect progress at every Scrum event.",
      "Adapt the plan based on inspection findings.",
      "Use Scrum values to guide behavior: be open, courageous, and respectful.",
      "The ScrumMaster ensures the empirical process is followed.",
    ],
    examples: [
      "If the team's Sprint progress is not transparent, the ScrumMaster should help make it visible through the Sprint Backlog and burndown chart.",
      "If inspection reveals the team is unlikely to meet the Sprint Goal, adapt by collaborating with the product owner to adjust scope.",
    ],
    focusAreas: [
      "Three pillars of empiricism",
      "Scrum values",
      "Empirical decision-making",
      "Transparency in practice",
      "When and how to adapt",
    ],
    commonTraps: [
      "Treating Scrum as a prescriptive process rather than an empirical framework.",
      "Hiding problems to avoid difficult conversations.",
      "Inspecting without adapting.",
      "Ignoring Scrum values when making tradeoffs.",
    ],
    practicePrompt:
      "For Scrum theory questions, the best answer relies on empiricism: transparency, inspection, and adaptation, supported by Scrum values.",
    practiceSet: [
      {
        prompt:
          "A team finishes each Sprint but consistently delivers less value than expected. The ScrumMaster notices the Daily Scrum is used for status reporting, not for inspection and adaptation. What should the ScrumMaster do?",
        options: [
          "Let the team run the Daily Scrum as they see fit",
          "Coach the team on the purpose of the Daily Scrum and its role in empirical process control",
          "Cancel the Daily Scrum since it is not working",
          "Ask the product owner to attend and direct the Daily Scrum",
        ],
        correctAnswer: 1,
        explanation:
          "The ScrumMaster coaches the team on Scrum theory and practices. The Daily Scrum is for inspecting progress and adapting the plan.",
      },
      {
        prompt:
          "During a Sprint Review, stakeholders express surprise at the current state of the product. What Scrum pillar has been violated?",
        options: [
          "Adaptation",
          "Inspection",
          "Transparency",
          "Commitment",
        ],
        correctAnswer: 2,
        explanation:
          "If stakeholders are surprised, the work was not transparent enough. The ScrumMaster should help the team improve transparency, perhaps through more frequent updates or clearer Definition of Done.",
      },
    ],
  },
  "scrum-events": {
    slug: "scrum-events",
    title: "Scrum Events",
    domain: "Scrum Events",
    summary:
      "Scrum defines five events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective. Each event has a specific purpose, time-box, and participants. Events are opportunities for inspection and adaptation.",
    mindset:
      "Events are not meetings — they are formal opportunities to inspect and adapt. Each event has a clear purpose. Skip or shorten events only when their purpose is already met. Time-boxes are maximums, not targets.",
    coreIdeas: [
      "The Sprint is a container for all other events. Maximum 1 month.",
      "Sprint Planning: plan the work for the Sprint (time-box: 8 hours for 1 month).",
      "Daily Scrum: 15-minute daily plan for the next 24 hours.",
      "Sprint Review: inspect the Increment and adapt the Product Backlog (time-box: 4 hours for 1 month).",
      "Sprint Retrospective: plan improvements for the next Sprint (time-box: 3 hours for 1 month).",
      "All events are time-boxed to the maximum duration, not a target.",
    ],
    howToThink: [
      "The Sprint is a time-box within which a usable Increment is created.",
      "Sprint Planning answers: Why is this Sprint valuable? What can be done? How will the work be done?",
      "The Daily Scrum inspects progress toward the Sprint Goal and adapts the Sprint Backlog.",
      "The Sprint Review includes stakeholders and results in a revised Product Backlog.",
      "The Sprint Retrospective focuses on people, relationships, process, and tools.",
    ],
    examples: [
      "If the Daily Scrum runs 30 minutes, the ScrumMaster helps the team refocus on planning the next 24 hours.",
      "If stakeholders want to add new work mid-Sprint, they are asked to bring it to the Sprint Planning or Sprint Review.",
    ],
    focusAreas: [
      "Sprint as a time-boxed iteration",
      "Sprint Planning (value, scope, plan)",
      "Daily Scrum (inspection, adaptation)",
      "Sprint Review (feedback, backlog refinement)",
      "Sprint Retrospective (improvement)",
    ],
    commonTraps: [
      "Treating the Sprint as a hard deadline rather than a time-box.",
      "Skipping the Sprint Retrospective.",
      "Extending the Sprint when work is not complete.",
      "Adding or changing scope during the Sprint without removing equivalent work.",
    ],
    practicePrompt:
      "For Scrum event questions, know the purpose, time-box, and participants of each event, and distinguish their roles.",
    practiceSet: [
      {
        prompt:
          "A stakeholder wants to add an urgent feature during the middle of a two-week Sprint. What is the best response?",
        options: [
          "Add the feature to the current Sprint and extend the Sprint duration",
          "Ask the team to add the feature and work overtime",
          "The product owner may replace lower-priority items with the new feature",
          "Refuse to accept any changes during the Sprint",
        ],
        correctAnswer: 2,
        explanation:
          "The product owner can negotiate with the team to swap items in the Sprint Backlog as long as the Sprint Goal remains achievable. The team should not simply add scope.",
      },
      {
        prompt:
          "During a Sprint Review, the team demonstrates a working Increment. Stakeholders provide significant feedback that would change the direction of the product. What is the best outcome of this event?",
        options: [
          "The team incorporates the feedback into the current Sprint",
          "The Product Backlog is revised based on the feedback",
          "The Sprint is canceled and restarted",
          "The feedback is documented for the next project phase",
        ],
        correctAnswer: 1,
        explanation:
          "The Sprint Review results in a revised Product Backlog that reflects the new direction. Feedback is captured and prioritized for future Sprints.",
      },
    ],
  },
  "scrum-artifacts": {
    slug: "scrum-artifacts",
    title: "Scrum Artifacts & Commitments",
    domain: "Scrum Artifacts",
    summary:
      "Scrum artifacts represent work or value: Product Backlog, Sprint Backlog, and Increment. Each artifact has a commitment to ensure transparency: Product Goal, Sprint Goal, and Definition of Done. These commitments help the team and stakeholders understand progress.",
    mindset:
      "Artifacts make key information visible. Commitments provide a clear target for each artifact: the Product Goal defines the product vision, the Sprint Goal defines the Sprint objective, and the Definition of Done ensures quality.",
    coreIdeas: [
      "Product Backlog: an ordered list of everything needed in the product. Commitment: Product Goal.",
      "Sprint Backlog: the Product Backlog items selected for the Sprint plus the plan for delivering them. Commitment: Sprint Goal.",
      "Increment: a usable step toward the Product Goal. Commitment: Definition of Done.",
      "All artifacts are transparent and updated as more is learned.",
      "The Product Backlog is never complete — it is an emergent artifact.",
    ],
    howToThink: [
      "The Product Backlog is a living document, ordered by value.",
      "The Sprint Backlog belongs to the Development Team, not the Product Owner.",
      "The Increment must meet the Definition of Done to be considered complete.",
      "The Product Goal provides a long-term vision for the Product Backlog.",
      "The Sprint Goal provides a single objective for the Sprint.",
    ],
    examples: [
      "If a team does not have a Definition of Done, the ScrumMaster should facilitate the team in creating one.",
      "If the Product Backlog is unordered, the Product Owner should prioritize it based on value.",
    ],
    focusAreas: [
      "Product Backlog and Product Goal",
      "Sprint Backlog and Sprint Goal",
      "Increment and Definition of Done",
      "Transparency of artifacts",
      "Emergent vs. fixed requirements",
    ],
    commonTraps: [
      "Letting stakeholders or management change the Sprint Backlog directly.",
      "Marking work 'Done' without meeting the Definition of Done.",
      "Treating the Product Backlog as a fixed requirements document.",
      "Having no Product Goal or Sprint Goal.",
    ],
    practicePrompt:
      "For artifact questions, identify which artifact and commitment applies, and who is responsible for each.",
    practiceSet: [
      {
        prompt:
          "During a Sprint, a team member completes a task but it does not meet the team's Definition of Done. What should happen?",
        options: [
          "The work is still counted as completed for the Sprint",
          "The work is not considered part of the Increment until it meets the Definition of Done",
          "The Definition of Done should be lowered to match the actual work",
          "The product owner decides whether it counts as done",
        ],
        correctAnswer: 1,
        explanation:
          "The Increment must meet the Definition of Done to be potentially releasable. Work that does not meet DoD should not be counted as complete.",
      },
      {
        prompt:
          "Who is responsible for ordering the Product Backlog?",
        options: [
          "The ScrumMaster",
          "The Development Team",
          "The Product Owner",
          "Stakeholders",
        ],
        correctAnswer: 2,
        explanation:
          "The Product Owner is accountable for Product Backlog management, including ordering items to maximize value.",
      },
    ],
  },
  "scrum-master-role": {
    slug: "scrum-master-role",
    title: "ScrumMaster Role & Responsibilities",
    domain: "ScrumMaster Role",
    summary:
      "The ScrumMaster is a servant leader for the Scrum Team, responsible for promoting and supporting Scrum as defined in the Scrum Guide. The ScrumMaster serves the Product Owner, Development Team, and organization by facilitating Scrum events, removing impediments, and coaching Scrum adoption.",
    mindset:
      "Lead by serving. Coach, facilitate, and remove impediments rather than command and control. Protect the team from distractions but let them self-organize. The ScrumMaster is accountable for the Scrum process, not for team output.",
    coreIdeas: [
      "The ScrumMaster is a servant leader — not a project manager, team lead, or manager.",
      "The ScrumMaster coaches the team in self-management and cross-functionality.",
      "The ScrumMaster causes the removal of impediments (directly or by coaching the team).",
      "The ScrumMaster facilitates Scrum events and ensures they are effective.",
      "The ScrumMaster helps the Product Owner with Product Backlog management techniques.",
      "The ScrumMaster helps the organization adopt Scrum.",
    ],
    howToThink: [
      "Ask: 'How can I help the team be more effective?' rather than 'How can I control the outcome?'",
      "Coach the team to solve its own problems when possible.",
      "Protect the team from external disruptions without isolating them.",
      "Facilitate, do not dictate. The team owns the Sprint Backlog.",
      "The ScrumMaster's authority comes from servant leadership, not organizational hierarchy.",
    ],
    examples: [
      "If the Product Owner struggles with backlog refinement, the ScrumMaster coaches them on techniques like story mapping or prioritization.",
      "If management asks the ScrumMaster to assign tasks to team members, the ScrumMaster explains that teams are self-managing.",
    ],
    focusAreas: [
      "Servant leadership",
      "Coaching the Development Team",
      "Coaching the Product Owner",
      "Impediment removal",
      "Facilitating Scrum events",
      "Organizational Scrum adoption",
    ],
    commonTraps: [
      "Acting as a project manager (assigning tasks, tracking status, reporting to management).",
      "Solving all team problems without coaching them to self-resolve.",
      "Trying to be the 'Scrum police' instead of an enabler.",
      "Focusing on team output rather than team effectiveness.",
    ],
    practicePrompt:
      "For ScrumMaster questions, the best answer demonstrates servant leadership: coaching, facilitating, removing impediments, and protecting the Scrum process.",
    practiceSet: [
      {
        prompt:
          "A Development Team member asks the ScrumMaster to assign work to team members because the current self-assignment is leading to conflict. What is the best response?",
        options: [
          "Assign work to team members as requested",
          "Coach the team in self-management techniques and facilitate a discussion about the workflow",
          "Escalate the issue to management",
          "Take over the Sprint Backlog management",
        ],
        correctAnswer: 1,
        explanation:
          "The ScrumMaster coaches the team on self-management rather than taking over the assignment process. Facilitating a discussion helps the team resolve the conflict themselves.",
      },
      {
        prompt:
          "The Product Owner is struggling to maintain a clear Product Backlog. Items are poorly defined and the team is confused about priorities. What should the ScrumMaster do?",
        options: [
          "Take over the Product Backlog management",
          "Coach the Product Owner on backlog refinement techniques and facilitate refinement sessions",
          "Ask stakeholders to define the backlog",
          "Let the team define the backlog during Sprint Planning",
        ],
        correctAnswer: 1,
        explanation:
          "The ScrumMaster coaches the Product Owner on techniques like user stories, acceptance criteria, and prioritization. The PO remains accountable for the backlog.",
      },
    ],
  },
  /* ── PSM I: Scrum Fundamentals (PSM) ── */
  "scrum-fundamentals": {
    slug: "scrum-fundamentals",
    title: "Scrum Fundamentals (PSM)",
    domain: "Scrum Fundamentals",
    summary:
      "PSM I tests deeper understanding of Scrum as defined in the Scrum Guide. Unlike CSM, PSM focuses more on the theory, rules, and accountabilities without adding external practices. Key topics include Scrum roles (accountabilities), events, artifacts, and the rules that bind them.",
    mindset:
      "Think strictly from the Scrum Guide. Do not add practices that Scrum does not require. Know the accountabilities, not titles. Understand that Scrum is a framework, not a methodology.",
    coreIdeas: [
      "Scrum has three accountabilities: Product Owner, ScrumMaster, and Developers.",
      "Scrum has five events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective.",
      "Scrum has three artifacts: Product Backlog, Sprint Backlog, Increment.",
      "Each artifact has a commitment: Product Goal, Sprint Goal, Definition of Done.",
      "The Sprint is a container for all other events. No event should be skipped.",
      "During a Sprint, no changes are made that would endanger the Sprint Goal.",
    ],
    howToThink: [
      "Refer back to the Scrum Guide as the authoritative source.",
      "Distinguish between accountabilities (Scrum roles) and job titles.",
      "Understand Scrum's rules: only the PO can cancel a Sprint, only Developers own the Sprint Backlog, etc.",
      "Know the commitments and how they relate to artifacts.",
      "Scrum is intentionally incomplete — it only defines what is necessary.",
    ],
    examples: [
      "If someone asks about a 'Scrum Master' (two words), the Scrum Guide uses 'Scrum Master' as one accountability.",
      "The Sprint Review includes the Product Backlog being adapted; the Sprint Retrospective results in an improvement plan.",
    ],
    focusAreas: [
      "Scrum accountabilities (PO, SM, Developers)",
      "Scrum events and time-boxes",
      "Artifacts and commitments",
      "Sprint rules (no changes endangering Sprint Goal)",
      "Scrum completeness (intentionally incomplete framework)",
    ],
    commonTraps: [
      "Adding practices that Scrum does not require (estimation techniques, burndown charts are optional).",
      "Confusing accountabilities with job titles.",
      "Thinking the ScrumMaster is part of the Development Team.",
      "Treating the Sprint Backlog as a fixed commitment.",
    ],
    practicePrompt:
      "For PSM I fundamentals, the correct answer follows the Scrum Guide strictly without adding or removing Scrum elements.",
    practiceSet: [
      {
        prompt:
          "According to the Scrum Guide, who is accountable for ensuring the Scrum Team understands Scrum theory, practices, and rules?",
        options: [
          "The Product Owner",
          "The Scrum Master",
          "The Developers",
          "All of the above share equal accountability",
        ],
        correctAnswer: 1,
        explanation:
          "The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide and for the Scrum Team's effectiveness.",
      },
      {
        prompt:
          "Which statement about the Sprint is true according to the Scrum Guide?",
        options: [
          "A Sprint can be extended if the team has not completed all work",
          "Sprints are time-boxed to one month or less",
          "Sprints can be any length the team chooses",
          "A Sprint must be exactly two weeks",
        ],
        correctAnswer: 1,
        explanation:
          "The Scrum Guide states that Sprints are time-boxed to one month or less. A new Sprint starts immediately after the previous Sprint.",
      },
    ],
  },
  empiricism: {
    slug: "empiricism",
    title: "Empiricism & Evidence-Based Management",
    domain: "Empiricism",
    summary:
      "PSM I emphasizes empiricism more deeply than CSM. Knowledge comes from experience and decisions are based on what is known. Evidence-Based Management (EBM) is an empirical approach to measuring and improving value delivery, organizational capability, and outcomes.",
    mindset:
      "Use data and evidence to drive decisions. Make hypotheses, run experiments, measure outcomes, and adapt. Empiricism means trusting what you observe over what you assume.",
    coreIdeas: [
      "Empiricism: knowledge comes from experience and making decisions based on what is known.",
      "Three pillars: transparency, inspection, adaptation.",
      "Evidence-Based Management (EBM) measures four key value areas: Current Value, Unrealized Value, Ability to Innovate, Time to Market.",
      "Empirical decisions use data, not intuition or hierarchy.",
      "Scrum's events are designed for empirical inspection and adaptation.",
    ],
    howToThink: [
      "What data do we have? What is observable?",
      "Is the work transparent enough to inspect?",
      "When inspection reveals a deviation, adapt immediately.",
      "Use EBM metrics to understand value beyond financial measures.",
      "Experiments (hypothesis-driven development) are consistent with empiricism.",
    ],
    examples: [
      "If the team's ability to innovate is declining (measured by EBM), investigate root causes in the Sprint Retrospective.",
      "If deployment frequency (Time to Market) is low, the team experiments with automation tools to improve.",
    ],
    focusAreas: [
      "Three pillars of empiricism",
      "Evidence-Based Management (EBM)",
      "Transparency in practice",
      "Hypothesis-driven development",
      "Using metrics for empirical decisions",
    ],
    commonTraps: [
      "Making decisions based on opinion rather than data.",
      "Selecting only metrics that confirm existing beliefs (confirmation bias).",
      "Treating EBM metrics as targets rather than indicators.",
      "Inspecting without adapting.",
    ],
    practicePrompt:
      "For empiricism questions, the best answer uses data and evidence, makes work transparent, and adapts based on inspection.",
    practiceSet: [
      {
        prompt:
          "A Scrum Team wants to understand whether they are delivering value efficiently. According to empiricism and EBM, what should they measure?",
        options: [
          "Only the budget spent vs. budget planned",
          "Current Value, Unrealized Value, Ability to Innovate, and Time to Market",
          "Number of story points completed per Sprint",
          "Team satisfaction survey results",
        ],
        correctAnswer: 1,
        explanation:
          "EBM defines four key value areas (KVAs) for empirical measurement: Current Value, Unrealized Value, Ability to Innovate, and Time to Market.",
      },
      {
        prompt:
          "During a Sprint Review, stakeholders are unhappy with the Increment's direction, despite the team meeting the Sprint Goal. What should the Scrum Master do?",
        options: [
          "Defend the team's work against stakeholder criticism",
          "Ignore stakeholder feedback since the Sprint Goal was met",
          "Facilitate the inspection and ensure the Product Backlog is adapted based on the new information",
          "Extend the Sprint to include the stakeholder's feedback",
        ],
        correctAnswer: 2,
        explanation:
          "Empiricism requires adaptation based on inspection. The Sprint Review is the time for stakeholders to inspect the Increment and for the Product Backlog to be adapted accordingly.",
      },
    ],
  },
  "scrum-roles-psm": {
    slug: "scrum-roles-psm",
    title: "Scrum Accountabilities",
    domain: "Scrum Roles",
    summary:
      "The Scrum Guide defines three accountabilities: Product Owner (maximizes value), Scrum Master (process effectiveness), and Developers (creating the Increment). Unlike CSM, PSM emphasizes these as accountabilities rather than roles, and highlights that they are not job titles but functions within a Scrum Team.",
    mindset:
      "Each accountability has clear boundaries. The Product Owner decides what to build and in what order. Developers decide how to build it. The Scrum Master ensures Scrum is understood and enacted.",
    coreIdeas: [
      "Product Owner: accountable for maximizing value of the product and managing the Product Backlog.",
      "Scrum Master: accountable for establishing Scrum and for the Scrum Team's effectiveness.",
      "Developers: accountable for creating the Increment each Sprint and owning the Sprint Backlog.",
      "Accountabilities are not job titles; one person may have multiple accountabilities (not recommended).",
      "No one outside the Development Team can tell Developers how to turn Product Backlog into Increments.",
    ],
    howToThink: [
      "Distinguish between what each accountability owns.",
      "The PO owns the 'what' and 'why'. The Developers own the 'how'.",
      "The SM owns the Scrum process, not the team or the product.",
      "Accountabilities are mutually exclusive — the Developers cannot delegate Sprint Backlog ownership.",
      "Scrum does not recognize sub-teams within the Development Team.",
    ],
    examples: [
      "If a stakeholder asks Developers to add a feature, they should redirect to the Product Owner.",
      "If management wants to split the Development Team into testers and coders, the Scrum Master explains there are no sub-teams in Scrum.",
    ],
    focusAreas: [
      "Product Owner accountability",
      "Scrum Master accountability",
      "Developers accountability",
      "Accountability boundaries",
      "No sub-teams within Developers",
    ],
    commonTraps: [
      "Treating accountabilities as job titles with implied hierarchy.",
      "Having the Scrum Master also serve as a Developer (technically possible but not recommended).",
      "Allowing the Product Owner to dictate technical implementation.",
      "Creating sub-teams (e.g., separate QA team) within the Developers.",
    ],
    practicePrompt:
      "For accountability questions, identify what each accountability owns and respect the boundaries between them.",
    practiceSet: [
      {
        prompt:
          "The Product Owner wants the Developers to implement a technical solution in a specific way. How should the Developers respond?",
        options: [
          "Follow the Product Owner's direction since they control value",
          "Explain that the Developers decide how to implement the work, while the PO focuses on the what and why",
          "Escalate to the Scrum Master",
          "Implement the solution as requested but document their disagreement",
        ],
        correctAnswer: 1,
        explanation:
          "The Developers own the 'how.' The Product Owner decides the 'what' and 'why.' The Scrum Master helps both sides understand these accountabilities.",
      },
      {
        prompt:
          "A company creates separate 'frontend developers' and 'backend developers' teams within a single Scrum Team. What does the Scrum Guide say?",
        options: [
          "This is acceptable if the work is complex",
          "Scrum does not recognize sub-teams within the Development Team",
          "The Scrum Master should lead the frontend team",
          "The Product Owner should be assigned to the backend team",
        ],
        correctAnswer: 1,
        explanation:
          "The Scrum Guide states there are no sub-teams within the Development Team. Cross-functional teams are preferred.",
      },
    ],
  },
  "scrum-events-artifacts-psm": {
    slug: "scrum-events-artifacts-psm",
    title: "Scrum Events & Artifacts (PSM)",
    domain: "Scrum Events & Artifacts",
    summary:
      "PSM I tests detailed knowledge of Scrum events and artifacts as defined in the Scrum Guide. Emphasis on time-boxes, purpose, who must attend, what outputs are expected, and how artifacts relate to their commitments. PSM expects strict adherence to Scrum Guide definitions.",
    mindset:
      "Know the exact time-boxes, participants, and purposes from the Scrum Guide. Understand that artifacts are designed for transparency and each has a commitment that ensures stakeholders have a clear understanding.",
    coreIdeas: [
      "Sprint Planning time-box: maximum 8 hours for a one-month Sprint. Produces Sprint Goal and Sprint Backlog.",
      "Daily Scrum: 15-minute daily event for Developers. Inspects progress toward Sprint Goal.",
      "Sprint Review time-box: maximum 4 hours for one month. Inspects Increment, adapts Product Backlog.",
      "Sprint Retrospective time-box: maximum 3 hours for one month. Plans improvements for next Sprint.",
      "Product Backlog is ordered; Sprint Backlog is owned by Developers; Increment must meet Definition of Done.",
      "Product Goal is the long-term objective for the Product Backlog.",
    ],
    howToThink: [
      "Memorize time-boxes relative to Sprint length.",
      "Know who must attend each event (e.g., PO and Developers must be at Sprint Review).",
      "Understand what each event produces (outputs).",
      "Artifacts must be transparent; if they are not, the process is not working.",
      "Commitments create accountability and alignment.",
    ],
    examples: [
      "If someone asks who can attend the Daily Scrum, the Scrum Guide says only the Developers are required; others can attend to observe.",
      "If the Increment does not meet Definition of Done, it cannot be released — even if the Product Owner wants to.",
    ],
    focusAreas: [
      "Sprint Planning time-box and outputs",
      "Daily Scrum purpose and participants",
      "Sprint Review time-box and outcomes",
      "Sprint Retrospective time-box and outcomes",
      "Artifact commitments (Product Goal, Sprint Goal, DoD)",
      "Transparency requirements for all artifacts",
    ],
    commonTraps: [
      "Thinking the Daily Scrum is for status reporting to the Scrum Master.",
      "Confusing Sprint Review (inspect Increment, adapt Backlog) with Sprint Retrospective (improve process).",
      "Allowing non-Developers to change the Sprint Backlog during the Sprint.",
      "Releasing an Increment that does not meet the Definition of Done.",
    ],
    practicePrompt:
      "For PSM I events and artifacts, the correct answer applies the Scrum Guide's exact definitions for time-boxes, participants, and outputs.",
    practiceSet: [
      {
        prompt:
          "A Scrum Team is in the Sprint Review. The Product Owner is absent. According to the Scrum Guide, what should happen?",
        options: [
          "Cancel the Sprint Review",
          "Proceed without the Product Owner and document feedback",
          "Reschedule the Sprint Review for when the Product Owner is available",
          "The Scrum Master acts as the Product Owner during the review",
        ],
        correctAnswer: 1,
        explanation:
          "The Sprint Review is required; it should proceed with the available participants. The PO's absence is a transparency issue to address in the Retrospective.",
      },
      {
        prompt:
          "What is the maximum time-box for Sprint Retrospective in a one-month Sprint?",
        options: [
          "1 hour",
          "2 hours",
          "3 hours",
          "4 hours",
        ],
        correctAnswer: 2,
        explanation:
          "The Scrum Guide states the Sprint Retrospective is time-boxed to a maximum of 3 hours for a one-month Sprint.",
      },
    ],
  },
  /* ── Six Sigma: DMAIC Overview ── */
  "dmaic-overview": {
    slug: "dmaic-overview",
    title: "DMAIC Methodology Overview",
    domain: "Six Sigma",
    summary:
      "DMAIC (Define, Measure, Analyze, Improve, Control) is the core problem-solving framework of Six Sigma. Each phase has a specific purpose: Define the problem and goals, Measure the current state, Analyze root causes, Improve the process, and Control the gains. Green Belts lead projects; Black Belts mentor and handle complex analysis.",
    mindset:
      "Think data-driven and structured. Every decision should be backed by measurement and statistical evidence. Avoid jumping to solutions — define and measure first, then analyze before improving.",
    coreIdeas: [
      "Define: charter the project, map the process, identify customer CTQs (Critical to Quality).",
      "Measure: collect baseline data, validate measurement systems, calculate process sigma.",
      "Analyze: identify root causes using data analysis, hypothesis testing, and process mapping.",
      "Improve: generate, select, and implement solutions; pilot before full rollout.",
      "Control: monitor the improved process, create control plans, sustain the gains.",
      "DMAIC is iterative — revisit earlier phases if new data surfaces.",
    ],
    howToThink: [
      "Start by clearly defining the problem and scope — a vague problem leads to vague solutions.",
      "Measure before you change — without baseline data, you cannot prove improvement.",
      "Analyze root causes, not symptoms — use tools like fishbone diagrams and 5 Whys.",
      "Improve with evidence — pilot solutions and measure results before full implementation.",
      "Control is not optional — without controls, processes revert to old patterns.",
    ],
    examples: [
      "A call center has high handle time. Define: reduce handle time by 20%. Measure: current avg = 8 min. Analyze: data shows hold time is the main driver. Improve: implement a knowledge base. Control: weekly handle time reports.",
      "A manufacturing line has 15% defect rate. Define: reduce defects to 5%. Measure: baseline data collected. Analyze: root cause is temperature variation. Improve: install temperature controllers. Control: SPC charts for temperature.",
    ],
    focusAreas: [
      "Define Phase deliverables (charter, SIPOC, CTQs)",
      "Measure Phase (baseline data, measurement system analysis)",
      "Analyze Phase (root cause analysis, hypothesis testing)",
      "Improve Phase (solution design, piloting, FMEA)",
      "Control Phase (SPC, control plans, process documentation)",
    ],
    commonTraps: [
      "Skipping the Measure phase and jumping to solutions.",
      "Defining the problem too broadly to be actionable.",
      "Implementing improvements without piloting or control plans.",
      "Using data that has not been validated for accuracy.",
    ],
    practicePrompt:
      "For DMAIC questions, identify which phase the scenario is in and choose the answer that fits the phase's purpose.",
    practiceSet: [
      {
        prompt:
          "A team is about to start a Six Sigma project to reduce order processing errors. They have a general sense that errors are high but no specific data. What should they do first?",
        options: [
          "Brainstorm solutions to reduce errors immediately",
          "Start the Define phase by chartering the project and identifying CTQs",
          "Purchase new software to automate order processing",
          "Train all staff on error reduction techniques",
        ],
        correctAnswer: 1,
        explanation:
          "The Define phase establishes the project scope, goals, and customer requirements before any data collection or solutions.",
      },
      {
        prompt:
          "After implementing a process improvement, the Six Sigma team wants to ensure the gains are sustained. What should they do?",
        options: [
          "Move on to the next project immediately",
          "Create a control plan with monitoring and response procedures",
          "Document the old process in case they need to revert",
          "Reduce sample sizes to save money on inspection",
        ],
        correctAnswer: 1,
        explanation:
          "The Control phase ensures sustained improvement through monitoring, control plans, and clear response procedures.",
      },
    ],
  },
  "process-mapping": {
    slug: "process-mapping",
    title: "Process Mapping & SIPOC",
    domain: "Six Sigma",
    summary:
      "Process maps (flowcharts, value stream maps) and SIPOC (Suppliers, Inputs, Process, Outputs, Customers) are foundational tools in Six Sigma. They help teams visualize the current state, identify waste, and find improvement opportunities before making changes.",
    mindset:
      "You cannot improve what you cannot see. A good process map reveals bottlenecks, redundancies, and non-value-added steps. SIPOC provides a high-level view before diving into detailed process analysis.",
    coreIdeas: [
      "SIPOC provides a high-level view of a process before detailed mapping.",
      "Value stream maps show both material and information flow.",
      "Swimlane diagrams clarify cross-functional handoffs and responsibilities.",
      "Process maps should reflect the current state, not the ideal state.",
      "Waste (muda) is identified by analyzing each process step for value.",
    ],
    howToThink: [
      "Start with SIPOC to scope the process boundaries.",
      "Map the current state as it actually happens, not as it should happen.",
      "Identify value-added vs. non-value-added steps.",
      "Look for delays, rework loops, and handoff issues.",
      "Validate the map with people who do the work daily.",
    ],
    examples: [
      "Before improving an invoice approval process, build a SIPOC to identify suppliers (departments submitting invoices), inputs, the approval process, outputs (approved/rejected invoices), and customers (vendors).",
      "A swimlane map reveals that approvals bounce between three managers, causing 5-day delays. Simplifying handoffs to two managers reduces cycle time by 40%.",
    ],
    focusAreas: [
      "SIPOC creation and analysis",
      "Current state vs. future state mapping",
      "Value-added vs. non-value-added analysis",
      "Swimlane and cross-functional maps",
      "Waste identification (TIMWOOD)",
    ],
    commonTraps: [
      "Mapping the ideal process instead of the actual process.",
      "Creating maps that are too detailed or too high-level.",
      "Ignoring information and decision flows.",
      "Not validating the map with process operators.",
    ],
    practicePrompt:
      "When asked to analyze a process, start with SIPOC or a current-state map before suggesting improvements.",
    practiceSet: [
      {
        prompt:
          "A Six Sigma team needs to understand the high-level boundaries and stakeholders of an order fulfillment process. What tool should they use first?",
        options: [
          "A detailed flowchart of every step",
          "A SIPOC diagram",
          "A Pareto chart",
          "A control chart",
        ],
        correctAnswer: 1,
        explanation:
          "SIPOC provides a high-level view of process boundaries, suppliers, inputs, outputs, and customers before detailed mapping.",
      },
      {
        prompt:
          "A process map reveals that customer orders go through four separate approval steps, each adding 1-2 days. Most approvals are rubber-stamped. What is the best improvement?",
        options: [
          "Add more approvers to ensure quality",
          "Eliminate unnecessary approval steps and automate routine approvals",
          "Increase the time allowed for each approval",
          "Document each approval step in more detail",
        ],
        correctAnswer: 1,
        explanation:
          "Non-value-added approval steps should be eliminated or streamlined. Reducing handoffs and automating routine approvals reduces cycle time.",
      },
    ],
  },
  "statistical-process-control": {
    slug: "statistical-process-control",
    title: "Statistical Process Control (SPC)",
    domain: "Six Sigma",
    summary:
      "Statistical Process Control (SPC) uses control charts to monitor process stability and detect special cause variation. It distinguishes between common cause variation (inherent to the process) and special cause variation (assignable). Green Belts interpret control charts; Black Belts design the sampling and analysis plans.",
    mindset:
      "Not all variation is bad — common cause variation is expected. The goal is to detect special causes quickly and take appropriate action without over-adjusting a stable process.",
    coreIdeas: [
      "Control charts have upper and lower control limits (UCL/LCL), typically ±3 sigma.",
      "Points outside control limits indicate special cause variation.",
      "Runs, trends, and cycles within limits can also indicate instability.",
      "Common cause variation requires process redesign; special causes need local fixes.",
      "Capability analysis (Cp, Cpk) measures how well a process meets specifications.",
    ],
    howToThink: [
      "First determine if the process is in statistical control (stable).",
      "If special causes are present, find and eliminate them before adjusting the process.",
      "If only common causes exist, the process needs fundamental redesign to improve.",
      "Do not adjust a stable process — it will only increase variation.",
      "Use the right type of control chart for the data (X-bar R, p, u, c charts).",
    ],
    examples: [
      "A control chart for call handle time shows three consecutive points above +2 sigma. This is a special cause pattern — investigate what changed in the past week.",
      "A process has Cp = 0.8, meaning it cannot meet specifications within its current variation. The team must redesign the process (reduce common cause variation) to improve capability.",
    ],
    focusAreas: [
      "Control chart interpretation (rules for special causes)",
      "Common cause vs. special cause distinction",
      "Process capability (Cp, Cpk, Pp, Ppk)",
      "Control chart selection by data type",
      "Rational subgrouping and sampling",
    ],
    commonTraps: [
      "Adjusting a stable process (tampering), which increases variation.",
      "Ignoring runs and trends within control limits that signal instability.",
      "Confusing control limits with specification limits.",
      "Using the wrong chart type for the data (e.g., using X-bar R for attribute data).",
    ],
    practicePrompt:
      "When interpreting a control chart, look for points outside limits, runs of 7+, and non-random patterns before deciding if a process is stable.",
    practiceSet: [
      {
        prompt:
          "A control chart shows that all points are within control limits, but the process output is still not meeting customer specifications. What does this indicate?",
        options: [
          "The process is not in control",
          "The process is stable but not capable",
          "The control limits are set too wide",
          "The customer specifications are too strict",
        ],
        correctAnswer: 1,
        explanation:
          "A stable (in-control) process may still be incapable if its natural variation exceeds specification limits. The process needs redesign.",
      },
      {
        prompt:
          "An operator adjusts a machine every time a measurement is close to the control limit, even though the process is stable. What is the likely result?",
        options: [
          "The process will become more capable",
          "The process variation will increase due to tampering",
          "The control limits will narrow automatically",
          "The specs will become easier to meet",
        ],
        correctAnswer: 1,
        explanation:
          "Tampering — adjusting a stable process — increases variation and makes the process less capable, not more.",
      },
    ],
  },
  "lean-principles": {
    slug: "lean-principles",
    title: "Lean Principles & Waste Reduction",
    domain: "Six Sigma",
    summary:
      "Lean focuses on eliminating waste (muda) and maximizing flow by delivering value to the customer with fewer resources. The seven wastes (TIMWOOD: Transport, Inventory, Motion, Waiting, Overprocessing, Overproduction, Defects) are the core focus. Kaizen (continuous improvement) and 5S (workplace organization) are key methods.",
    mindset:
      "Every step in a process either adds value or is waste. The goal is to maximize value-added steps and systematically eliminate waste. Start from the customer's perspective.",
    coreIdeas: [
      "Value is defined by the customer — anything the customer would not pay for is waste.",
      "TIMWOOD: Transport, Inventory, Motion, Waiting, Overprocessing, Overproduction, Defects.",
      "5S: Sort, Set in Order, Shine, Standardize, Sustain.",
      "Kaizen: small, continuous improvements involving all employees.",
      "Just-in-Time (JIT): produce only what is needed, when it is needed.",
      "Kanban: visual signaling system to control production and inventory.",
    ],
    howToThink: [
      "Identify the type of waste in the scenario.",
      "Ask whether the step adds value from the customer's perspective.",
      "Use 5S to organize the workplace before making complex changes.",
      "Implement pull systems (kanban) to reduce overproduction.",
      "Engage the people who do the work in kaizen improvements.",
    ],
    examples: [
      "A warehouse where workers walk 15 minutes to find parts is Motion waste. Reorganizing by frequency of use reduces walking time.",
      "A team produces reports that nobody reads — that is Overprocessing waste. Stop producing them.",
    ],
    focusAreas: [
      "Seven wastes (TIMWOOD) identification",
      "5S methodology",
      "Kaizen and continuous improvement",
      "Kanban and pull systems",
      "JIT and flow optimization",
      "Value stream mapping for lean",
    ],
    commonTraps: [
      "Confusing Motion (people moving) with Transport (materials moving).",
      "Implementing lean tools without understanding the underlying waste.",
      "Treating kaizen as a one-time event instead of a continuous practice.",
      "Reducing inventory without addressing the causes of high inventory.",
    ],
    practicePrompt:
      "For lean questions, identify which type of waste TIMWOOD applies and choose the countermeasure that addresses that specific waste.",
    practiceSet: [
      {
        prompt:
          "A hospital pharmacy stores medications in alphabetical order regardless of how often they are used. Pharmacists walk across the room frequently for common drugs. What type of waste is this?",
        options: [
          "Transport waste",
          "Motion waste",
          "Waiting waste",
          "Inventory waste",
        ],
        correctAnswer: 1,
        explanation:
          "Motion waste refers to unnecessary movement of people. Reorganizing by frequency of use reduces motion.",
      },
      {
        prompt:
          "A factory produces 20% more units than customers order each day 'just in case.' The extra units sit in storage for weeks. What waste does this represent?",
        options: [
          "Defect waste",
          "Motion waste",
          "Overproduction waste",
          "Waiting waste",
        ],
        correctAnswer: 2,
        explanation:
          "Overproduction is making more than the customer needs. It is the most serious waste because it hides other wastes and ties up capital.",
      },
    ],
  },
  "measurement-system-analysis": {
    slug: "measurement-system-analysis",
    title: "Measurement System Analysis (MSA)",
    domain: "Six Sigma",
    summary:
      "Measurement System Analysis (MSA) validates that the data used for Six Sigma decisions is reliable. Gage R&R studies (repeatability and reproducibility) assess measurement variation. Without valid measurements, data-driven decisions are meaningless.",
    mindset:
      "Before analyzing data, confirm the measurement system is trustworthy. If you cannot measure accurately, you cannot improve.",
    coreIdeas: [
      "Accuracy (calibration): measurements match the true value.",
      "Precision (repeatability): the same operator gets the same result measuring the same part multiple times.",
      "Reproducibility: different operators get consistent results measuring the same parts.",
      "Gage R&R: combined repeatability and reproducibility variation.",
      "Guideline: Gage R&R < 10% is excellent; 10-30% is acceptable; > 30% needs improvement.",
      "Attribute agreement analysis: used for pass/fail or categorical measurements.",
    ],
    howToThink: [
      "Ask whether the measurement system has been validated before trusting the data.",
      "If Gage R&R is high, improve the measurement system before collecting more data.",
      "Calibration ensures accuracy; Gage R&R ensures precision.",
      "Operator training and clear procedures reduce reproducibility variation.",
      "Involve operators in designing the measurement study.",
    ],
    examples: [
      "A Gage R&R study shows 35% variation. The team calibrates gages and retrains operators, reducing R&R to 12%. Now the data can be trusted for analysis.",
      "In a call center, two quality auditors evaluate the same calls and agree only 70% of the time. Attribute agreement analysis reveals inconsistent scoring criteria.",
    ],
    focusAreas: [
      "Gage R&R studies (crossed, nested, expanded)",
      "Repeatability vs. reproducibility",
      "Accuracy vs. precision",
      "Attribute agreement analysis",
      "Bias, linearity, and stability studies",
      "Measurement system improvement",
    ],
    commonTraps: [
      "Analyzing data before validating the measurement system.",
      "Confusing accuracy (calibration) with precision (Gage R&R).",
      "Using a measurement system with >30% Gage R&R for critical decisions.",
      "Assuming digital measurements are always accurate without validation.",
    ],
    practicePrompt:
      "Before trusting any data for Six Sigma decisions, confirm the measurement system has been validated with an appropriate MSA study.",
    practiceSet: [
      {
        prompt:
          "A Six Sigma team collects defect data from visual inspection by three operators. Before analyzing the data, what should they do?",
        options: [
          "Start root cause analysis immediately",
          "Conduct an attribute agreement analysis to validate inspector consistency",
          "Average the three operators' data to get a single number",
          "Use only the most experienced inspector's data",
        ],
        correctAnswer: 1,
        explanation:
          "Attribute agreement analysis validates that inspectors consistently classify defects the same way before data can be trusted.",
      },
      {
        prompt:
          "A Gage R&R study for a critical measurement yields 28% variation. What should the team do?",
        options: [
          "Proceed with analysis since 28% is below 30%",
          "Improve the measurement system and reassess before analysis",
          "Ignore the Gage R&R result and focus on improvement",
          "Reduce the number of operators to lower variation",
        ],
        correctAnswer: 1,
        explanation:
          "28% is at the upper limit of acceptability. Improving the measurement system would provide more reliable data for decision-making.",
      },
    ],
  },
};

export function getLearningTopicForQuestion(input: {
  question: string;
  domain?: string;
  topic?: string;
  certSlug?: string;
}): LearningTopic {
  const domain = input.domain?.toLowerCase() ?? "";
  const topic = input.topic?.toLowerCase() ?? "";
  const question = input.question.toLowerCase();
  const certSlug = input.certSlug ?? "pmp";
  const text = `${domain} ${topic} ${question}`;

  // ── PMP topics ──
  if (certSlug === "pmp") {
    if (text.includes("risk")) return learningTopics.risk;
    if (text.includes("stakeholder") || text.includes("communication")) return learningTopics.stakeholder;
    if (text.includes("ai") || text.includes("artificial intelligence")) return learningTopics.ai;
    if (text.includes("sustainability") || text.includes("sustainable") || text.includes("environmental") || text.includes("social") || text.includes("esg")) return learningTopics.sustainability;
    if (text.includes("value") || text.includes("benefit") || text.includes("business") || text.includes("strategy")) return learningTopics.value;
    if (text.includes("hybrid") || text.includes("compliance")) return learningTopics.hybrid;
    return learningTopics.agile;
  }

  // ── PMI-ACP topics ──
  if (certSlug === "pmi-acp") {
    if (text.includes("stakeholder") || text.includes("communication") || text.includes("engagement")) return learningTopics["stakeholder-engagement-acp"];
    if (text.includes("value") || text.includes("benefit") || text.includes("moscow") || text.includes("kano")) return learningTopics["value-driven-delivery"];
    if (text.includes("team") || text.includes("velocity") || text.includes("impediment") || text.includes("retrospective")) return learningTopics["team-performance"];
    if (text.includes("plan") || text.includes("estimate") || text.includes("horizon") || text.includes("rolling-wave")) return learningTopics["adaptive-planning"];
    return learningTopics["agile-principles"];
  }

  // ── CAPM topics ──
  if (certSlug === "capm") {
    if (text.includes("project") && (text.includes("definition") || text.includes("triple") || text.includes("constraint") || text.includes("charter") || text.includes("lifecycle") || text.includes("organization") || text.includes("operations"))) return learningTopics["project-fundamentals"];
    if (text.includes("predictive") || text.includes("waterfall") || text.includes("wbs") || text.includes("critical path") || text.includes("earned value") || text.includes("evm")) return learningTopics["predictive-methods"];
    if (text.includes("scrum") || text.includes("sprint") || text.includes("user story") || text.includes("backlog")) return learningTopics["agile-methods-capm"];
    if (text.includes("requirement") || text.includes("analysis") || text.includes("traceability") || text.includes("stakeholder need") || text.includes("needs assessment")) return learningTopics["business-analysis-capm"];
    return learningTopics["project-fundamentals"];
  }

  // ── CSM topics ──
  if (certSlug === "csm") {
    if (text.includes("empiricism") || text.includes("transparency") || text.includes("inspection") || text.includes("adaptation") || text.includes("pillar") || text.includes("value")) return learningTopics["scrum-theory"];
    if (text.includes("sprint planning") || text.includes("daily scrum") || text.includes("sprint review") || text.includes("retrospective") || text.includes("time-box")) return learningTopics["scrum-events"];
    if (text.includes("backlog") || text.includes("increment") || text.includes("definition of done") || text.includes("product goal") || text.includes("sprint goal") || text.includes("artifact")) return learningTopics["scrum-artifacts"];
    if (text.includes("scrum master") || text.includes("servant leader") || text.includes("coach") || text.includes("facilitate") || text.includes("impediment")) return learningTopics["scrum-master-role"];
    return learningTopics["scrum-fundamentals"];
  }

  // ── PSM I topics ──
  if (certSlug === "psm-i") {
    if (text.includes("empiricism") || text.includes("transparency") || text.includes("inspection") || text.includes("adaptation") || text.includes("complexity") || text.includes("ebm") || text.includes("evidence")) return learningTopics.empiricism;
    if (text.includes("accountability") || text.includes("product owner") || text.includes("developer") || text.includes("role") || text.includes("boundary")) return learningTopics["scrum-roles-psm"];
    if (text.includes("time-box") || text.includes("sprint") || text.includes("daily scrum") || text.includes("review") || text.includes("retrospective") || text.includes("artifact")) return learningTopics["scrum-events-artifacts-psm"];
    return learningTopics["scrum-fundamentals"];
  }

  // ── Six Sigma topics ──
  if (certSlug === "six-sigma") {
    if (text.includes("define") || text.includes("measure") || text.includes("analyze") || (text.includes("improve") && !text.includes("continuous")) || text.includes("control") || text.includes("dmaic") || text.includes("ctq")) return learningTopics["dmaic-overview"];
    if (text.includes("sipoc") || text.includes("process map") || text.includes("flowchart") || text.includes("value stream") || text.includes("swimlane") || text.includes("handoff")) return learningTopics["process-mapping"];
    if (text.includes("control chart") || text.includes("spc") || text.includes("variation") || text.includes("capability") || text.includes("sigma level") || text.includes("defect")) return learningTopics["statistical-process-control"];
    if (text.includes("lean") || text.includes("waste") || text.includes("muda") || text.includes("kaizen") || text.includes("just-in-time") || text.includes("pull") || text.includes("continuous improvement")) return learningTopics["lean-principles"];
    if (text.includes("gage") || text.includes("measurement system") || text.includes("calibration") || text.includes("repeatability") || text.includes("reproducibility") || text.includes("attribute agreement")) return learningTopics["measurement-system-analysis"];
    return learningTopics["dmaic-overview"];
  }

  // ── Fallback: PMP keyword matching for unknown cert slugs ──
  if (text.includes("risk")) return learningTopics.risk;
  if (text.includes("stakeholder") || text.includes("communication")) return learningTopics.stakeholder;
  if (text.includes("ai") || text.includes("artificial intelligence")) return learningTopics.ai;
  if (text.includes("sustainability") || text.includes("sustainable") || text.includes("environmental") || text.includes("social") || text.includes("esg")) return learningTopics.sustainability;
  if (text.includes("value") || text.includes("benefit") || text.includes("business") || text.includes("strategy")) return learningTopics.value;
  if (text.includes("hybrid") || text.includes("compliance")) return learningTopics.hybrid;
  return learningTopics.agile;
}
