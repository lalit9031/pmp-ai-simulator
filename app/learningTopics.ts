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
}) {
  const domain = input.domain?.toLowerCase() ?? "";
  const topic = input.topic?.toLowerCase() ?? "";
  const question = input.question.toLowerCase();
  const text = `${domain} ${topic} ${question}`;

  if (text.includes("risk")) {
    return learningTopics.risk;
  }

  if (text.includes("stakeholder") || text.includes("communication")) {
    return learningTopics.stakeholder;
  }

  if (text.includes("ai") || text.includes("artificial intelligence")) {
    return learningTopics.ai;
  }

  if (
    text.includes("sustainability") ||
    text.includes("sustainable") ||
    text.includes("environmental") ||
    text.includes("social") ||
    text.includes("esg")
  ) {
    return learningTopics.sustainability;
  }

  if (
    text.includes("value") ||
    text.includes("benefit") ||
    text.includes("business") ||
    text.includes("strategy")
  ) {
    return learningTopics.value;
  }

  if (text.includes("hybrid") || text.includes("compliance")) {
    return learningTopics.hybrid;
  }

  return learningTopics.agile;
}
