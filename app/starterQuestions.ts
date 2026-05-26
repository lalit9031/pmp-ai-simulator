/**
 * Starter question banks for each certification.
 * Used as initial questions before AI-generated ones load.
 */

import type { CertSlug, QuestionType } from "./certifications";

export type StarterQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain?: string;
  difficulty?: string;
  questionType?: QuestionType;
  /** For matching questions */
  matchItems?: { left: string; right: string }[];
  /** For fill-in-blank */
  blankType?: "number" | "text";
  /** For drag-to-order */
  orderItems?: string[];
  /** For multiple-response questions */
  correctAnswers?: number[];
};

export const starterQuestions: Record<string, StarterQuestion[]> = {
  pmp: [
    // ── People Domain ──
    {
      question: "Two senior team members disagree on the technical approach for a critical deliverable, causing tension in daily stand-ups. What should the project manager do first?",
      options: [
        "Escalate the conflict to the sponsor for resolution",
        "Facilitate a respectful discussion to understand both perspectives and guide the team toward a decision",
        "Choose the approach that keeps the project on schedule and assign it",
        "Ask the two members to resolve it privately without involving the team",
      ],
      correctAnswer: 1,
      explanation: "The project manager should facilitate conflict resolution by creating a safe environment for open discussion. PMI's People domain emphasizes leading teams through collaborative conflict management.",
      domain: "People",
      difficulty: "Medium",
    },
    {
      question: "A new team member is struggling with the agile workflow and their velocity is well below expectations. What should the project manager do?",
      options: [
        "Replace the team member with someone more experienced",
        "Assign a mentor and provide coaching to support performance improvement",
        "Reduce the team's sprint commitment to accommodate the skill gap",
        "Document the performance issue in the project records",
      ],
      correctAnswer: 1,
      explanation: "Supporting team performance through coaching and mentoring is a core People domain competency. PMI expects the project manager to develop team capabilities before considering replacements.",
      domain: "People",
      difficulty: "Easy",
    },
    {
      question: "A stakeholder with strong influence is consistently late providing input on deliverables, which is delaying the team. What is the best approach?",
      options: [
        "Proceed without their input and document assumptions",
        "Escalate the stakeholder's behavior to senior management",
        "Meet with the stakeholder to understand barriers and agree on a realistic engagement schedule",
        "Remove the stakeholder from the distribution list",
      ],
      correctAnswer: 2,
      explanation: "Empowering stakeholders through tailored engagement strategies is essential in the People domain. The project manager should first understand the root cause before escalating.",
      domain: "People",
      difficulty: "Medium",
    },
    // ── Process Domain ──
    {
      question: "During a sprint review, stakeholders request significant scope changes that would require reprioritizing the product backlog. The product owner is unsure how to proceed. What should the project manager do?",
      options: [
        "Approve the changes to keep stakeholders satisfied",
        "Advise the product owner to assess the impact on the sprint goal and release timeline before accepting changes",
        "Request a formal change request from the change control board",
        "Reject the changes since the sprint is already in progress",
      ],
      correctAnswer: 1,
      explanation: "In agile/hybrid execution, scope is managed through the product owner with backlog reprioritization. The Process domain requires managing changes through the appropriate method based on the delivery approach.",
      domain: "Process",
      difficulty: "Medium",
    },
    {
      question: "The project budget is trending over allocation due to unforeseen rework in the testing phase. What is the project manager's best first action?",
      options: [
        "Reduce team overtime to cut costs",
        "Analyze the variance, identify root causes, and evaluate corrective options with the team",
        "Request additional budget from the sponsor immediately",
        "Freeze all non-essential project activities",
      ],
      correctAnswer: 1,
      explanation: "Budget management in the Process domain starts with analysis. The project manager should understand variance drivers before taking corrective action or requesting changes.",
      domain: "Process",
      difficulty: "Hard",
    },
    {
      question: "A predictive project phase is complete, but the formal sign-off is delayed because a key approver is unavailable. What should the project manager do?",
      options: [
        "Proceed to the next phase without sign-off to avoid delays",
        "Document the situation, escalate through the governance process, and secure alternative approval authority",
        "Wait indefinitely until the approver becomes available",
        "Close the phase without approval and treat it as accepted risk",
      ],
      correctAnswer: 1,
      explanation: "Phase gate control is part of process execution. The project manager should follow governance procedures while actively working to resolve the approval bottleneck.",
      domain: "Process",
      difficulty: "Hard",
    },
    // ── Business Environment Domain ──
    {
      question: "New government regulations are announced that could affect how customer data is handled in the project's final product. What should the project manager do first?",
      options: [
        "Continue as planned since the regulation is not yet enforced",
        "Evaluate the regulation's impact on scope, schedule, and compliance requirements with the relevant experts",
        "Immediately halt all project work until the regulation is clarified",
        "Assign a compliance officer to monitor future regulatory changes",
      ],
      correctAnswer: 1,
      explanation: "The Business Environment domain requires the project manager to assess external impacts on the project. Proactive evaluation before taking action demonstrates strategic alignment.",
      domain: "Business Environment",
      difficulty: "Hard",
    },
    {
      question: "The organization is restructuring, and the project sponsor may be reassigned. This uncertainty is affecting team morale and stakeholder confidence. What should the project manager do?",
      options: [
        "Wait for the restructuring to be finalized before taking any action",
        "Communicate transparently with the team about what is known, maintain focus on delivery, and prepare for sponsor transition",
        "Ask the departing sponsor to secure a replacement before they leave",
        "Escalate to the PMO and request project closure",
      ],
      correctAnswer: 1,
      explanation: "Supporting organizational change while maintaining delivery momentum is a key Business Environment competency. Transparency and continuity planning are preferred over reactive shutdown.",
      domain: "Business Environment",
      difficulty: "Medium",
    },
    {
      question: "An external audit finds that the project's procurement process does not meet the organization's new sustainability standards. What should the project manager do?",
      options: [
        "Complete current procurement under old standards and update for future purchases",
        "Review the findings, update procurement procedures to align with standards, and communicate the change to the team and vendors",
        "Argue that the audit standards were not part of the original project scope",
        "Request a waiver from the audit committee for this project",
      ],
      correctAnswer: 1,
      explanation: "The Business Environment domain includes strategic alignment with organizational policies and external standards. Compliance must be addressed proactively.",
      domain: "Business Environment",
      difficulty: "Medium",
    },
    // ── Multiple Response (Select All That Apply) ──
    {
      question: "A project manager discovers that the project's risk register has not been updated in three months, and several identified risks have changed significantly. Which actions should the project manager take? (Select all that apply)",
      options: [
        "Schedule a risk review workshop with the team and key stakeholders",
        "Update risk probability and impact assessments based on current information",
        "Delete risks that have not occurred yet to simplify the register",
        "Reassign risk owners as needed and validate response strategies",
        "Remove all low-priority risks to focus on high-priority items only",
      ],
      correctAnswer: 0,
      correctAnswers: [0, 1, 3],
      explanation: "Risk management is a continuous process. The project manager should review, reassess, reassign, and update risks with the team. Deleting or removing risks without proper evaluation violates PMI's risk management principles.",
      domain: "Process",
      difficulty: "Hard",
      questionType: "multiple-response",
    },
    {
      question: "The project is entering its closing phase. Which of the following activities must the project manager complete? (Select all that apply)",
      options: [
        "Obtain formal acceptance of deliverables from the customer",
        "Release project resources and document lessons learned",
        "Begin a new project charter for the next phase",
        "Close all procurement contracts and settle outstanding claims",
        "Update the business case with final project costs",
      ],
      correctAnswer: 1,
      correctAnswers: [0, 1, 3],
      explanation: "Project closure requires formal acceptance, resource release, lessons learned documentation, and contract closure. Starting a new charter and updating the business case are not standard closure activities.",
      domain: "Process",
      difficulty: "Easy",
      questionType: "multiple-response",
    },
    // ── Situational (Scenario) ──
    {
      question: "A virtual team spanning four time zones is struggling with collaboration. Communication is fragmented and decisions are slow because team members rely mostly on email. What should the project manager do first?",
      options: [
        "Implement a daily video stand-up at a rotating time to include all time zones",
        "Ask each team member to send a detailed status email every morning",
        "Require all team members to relocate to the same office",
        "Reduce the team's deliverables until collaboration improves",
      ],
      correctAnswer: 0,
      explanation: "The situational question tests the project manager's ability to choose the most practical first step. A rotating daily stand-up increases synchronous collaboration without forcing relocation or reducing output.",
      domain: "People",
      difficulty: "Easy",
      questionType: "situational",
    },
    {
      question: "A critical vendor notifies the project manager that a key component will be delayed by two weeks due to supply chain issues. The delay will push the project past the contractual deadline. What is the project manager's best next step?",
      options: [
        "Accept the delay and update the project schedule",
        "Analyze the impact on the critical path and evaluate mitigation options such as fast-tracking or crashing",
        "Immediately switch to a different vendor",
        "Notify the customer about the delay without further analysis",
      ],
      correctAnswer: 1,
      explanation: "Before communicating delays externally or making drastic decisions, the project manager should analyze schedule impact and explore mitigation strategies. This reflects the Process domain's emphasis on data-driven decision-making.",
      domain: "Process",
      difficulty: "Medium",
      questionType: "situational",
    },
  ],
  "pmi-acp": [
    {
      question: "An agile team's velocity has dropped significantly over the last two iterations. What should the agile coach do first?",
      options: [
        "Ask the team to work overtime to recover velocity",
        "Facilitate a retrospective to identify root causes of the drop",
        "Report the drop to stakeholders immediately",
        "Reduce the scope of upcoming iterations",
      ],
      correctAnswer: 1,
      explanation: "Agile coaches should help the team inspect and adapt. A retrospective creates a safe space to analyze the root cause.",
      domain: "Team Performance",
      difficulty: "Medium",
    },
    {
      question: "A product owner wants to add a high-priority story mid-sprint. The team is already at capacity. What should happen?",
      options: [
        "The team should accept the story and remove lower-priority work",
        "The product owner should wait until the next sprint planning",
        "The agile coach should decide for the team",
        "The team should work extra hours to include the story",
      ],
      correctAnswer: 0,
      explanation: "In agile, the team can swap work mid-sprint if it adds more value, but not simply add scope. The lowest-value item should be removed.",
      domain: "Value-Driven Delivery",
      difficulty: "Easy",
    },
    {
      question: "During a daily standup, a developer mentions a significant impediment that will take days to resolve. What is the best response?",
      options: [
        "Ask the team to solve it during the standup",
        "Note the impediment and arrange a separate discussion after standup",
        "Escalate immediately to management",
        "Ignore the impediment and continue",
      ],
      correctAnswer: 1,
      explanation: "Standups are for inspection and coordination, not problem-solving. Impediments should be addressed separately.",
      domain: "Agile Principles",
      difficulty: "Easy",
    },
    {
      question: "A distributed agile team has conflicts arising from time zone differences in daily standups. What is the best approach?",
      options: [
        "Require everyone to work the same hours",
        "Rotate standup times and use asynchronous updates",
        "Eliminate standups for distributed teams",
        "Hold standups once per week only",
      ],
      correctAnswer: 1,
      explanation: "Agile practices should be tailored to the team's context. Rotating times and async updates are effective for distributed teams.",
      domain: "Team Performance",
      difficulty: "Medium",
    },
    {
      question: "The team's cycle time is increasing. What metric should the agile coach analyze first?",
      options: [
        "Team satisfaction score",
        "Work in progress (WIP) limits",
        "Number of team members",
        "Budget variance",
      ],
      correctAnswer: 1,
      explanation: "High WIP is a common cause of increased cycle time. Analyzing WIP limits helps identify bottlenecks.",
      domain: "Continuous Improvement",
      difficulty: "Hard",
    },
    {
      question: "Stakeholders are unhappy because they expected a different feature than what the team delivered. What went wrong?",
      options: [
        "The team did not work hard enough",
        "Acceptance criteria were not clearly defined and reviewed",
        "The product owner changed priorities too late",
        "The sprint was too short",
      ],
      correctAnswer: 1,
      explanation: "Clear, reviewed acceptance criteria during backlog refinement prevent mismatched expectations.",
      domain: "Stakeholder Engagement",
      difficulty: "Easy",
    },
  ],
  capm: [
    {
      question: "Which process group includes the development of the project charter?",
      options: [
        "Planning Process Group",
        "Initiating Process Group",
        "Executing Process Group",
        "Monitoring and Controlling Process Group",
      ],
      correctAnswer: 1,
      explanation: "The project charter is developed in the Initiating Process Group, which authorizes the project or phase.",
      domain: "Project Fundamentals",
      difficulty: "Easy",
    },
    {
      question: "What is the primary purpose of the Work Breakdown Structure (WBS)?",
      options: [
        "To show project dependencies",
        "To decompose project work into manageable components",
        "To define the project schedule",
        "To allocate resources to tasks",
      ],
      correctAnswer: 1,
      explanation: "The WBS is a deliverable-oriented decomposition of work that helps the team organize and understand the total scope.",
      domain: "Predictive Methods",
      difficulty: "Easy",
    },
    {
      question: "In predictive project management, what is the critical path?",
      options: [
        "The longest sequence of activities that determines the project duration",
        "The path with the most resources assigned",
        "The shortest path through the project network",
        "The sequence of activities with the highest cost",
      ],
      correctAnswer: 0,
      explanation: "The critical path is the longest path through the project schedule, determining the earliest completion date.",
      domain: "Predictive Methods",
      difficulty: "Medium",
    },
    {
      question: "Which document formally authorizes the existence of a project?",
      options: [
        "Project management plan",
        "Project charter",
        "Statement of work",
        "Business case",
      ],
      correctAnswer: 1,
      explanation: "The project charter is issued by the sponsor and formally authorizes the project, giving the project manager authority.",
      domain: "Project Fundamentals",
      difficulty: "Easy",
    },
    {
      question: "What does RAM (Responsibility Assignment Matrix) show?",
      options: [
        "Project risks and their owners",
        "Communication channels between stakeholders",
        "The relationship between work packages and team members",
        "Resource rates and costs",
      ],
      correctAnswer: 2,
      explanation: "A RAM shows the mapping of work packages or activities to team members, clarifying responsibilities.",
      domain: "Project Fundamentals",
      difficulty: "Medium",
    },
    {
      question: "In an agile approach, who is responsible for prioritizing the backlog?",
      options: [
        "The project manager",
        "The development team",
        "The product owner",
        "The scrum master",
      ],
      correctAnswer: 2,
      explanation: "The product owner is responsible for ordering the product backlog items to maximize value.",
      domain: "Agile Methods",
      difficulty: "Easy",
    },
  ],
  csm: [
    {
      question: "What is the primary role of the ScrumMaster?",
      options: [
        "To manage the team's tasks and deadlines",
        "To ensure the team follows Scrum theory, practices, and rules",
        "To make all final decisions for the team",
        "To write user stories for the product owner",
      ],
      correctAnswer: 1,
      explanation: "The ScrumMaster is responsible for promoting and supporting Scrum as defined in the Scrum Guide.",
      domain: "ScrumMaster Role",
      difficulty: "Easy",
    },
    {
      question: "How long is the maximum time-box for a Sprint Retrospective in a one-month Sprint?",
      options: [
        "1 hour",
        "2 hours",
        "3 hours",
        "4 hours",
      ],
      correctAnswer: 2,
      explanation: "For a one-month Sprint, the Sprint Retrospective is time-boxed to a maximum of 3 hours.",
      domain: "Scrum Events",
      difficulty: "Medium",
    },
    {
      question: "Who is responsible for the Product Backlog items estimation?",
      options: [
        "The product owner",
        "The scrum master",
        "The development team",
        "Stakeholders",
      ],
      correctAnswer: 2,
      explanation: "The Development Team is responsible for all estimates regarding Product Backlog items.",
      domain: "Scrum Artifacts",
      difficulty: "Easy",
    },
    {
      question: "What is the purpose of the Daily Scrum?",
      options: [
        "To report status to the scrum master",
        "To inspect progress toward the Sprint Goal and adapt the Sprint Backlog",
        "To assign daily tasks to team members",
        "To resolve technical issues",
      ],
      correctAnswer: 1,
      explanation: "The Daily Scrum is a 15-minute event for the Development Team to inspect progress and adapt the plan.",
      domain: "Scrum Events",
      difficulty: "Easy",
    },
    {
      question: "What happens if the Development Team determines they cannot complete all Sprint Backlog items?",
      options: [
        "The Sprint is extended",
        "The product owner decides what can be removed from the Sprint Backlog",
        "The scrum master takes over the remaining work",
        "The Sprint is cancelled",
      ],
      correctAnswer: 1,
      explanation: "The product owner, in consultation with the team, may remove items from the Sprint Backlog if necessary.",
      domain: "Scrum Theory",
      difficulty: "Medium",
    },
  ],
  "psm-i": [
    {
      question: "Scrum is founded on which three pillars of empirical process control?",
      options: [
        "Planning, Execution, Monitoring",
        "Transparency, Inspection, Adaptation",
        "Roles, Events, Artifacts",
        "Sprint, Release, Product",
      ],
      correctAnswer: 1,
      explanation: "Scrum is built on transparency, inspection, and adaptation — the three pillars of empirical process control.",
      domain: "Scrum Fundamentals",
      difficulty: "Easy",
    },
    {
      question: "What is the definition of 'Done' in Scrum?",
      options: [
        "A list of items the team hopes to complete",
        "A formal description of the state when the Increment meets quality measures",
        "The date when all user stories are accepted",
        "The product owner's approval of the sprint work",
      ],
      correctAnswer: 1,
      explanation: "The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required.",
      domain: "Done & Forecasting",
      difficulty: "Medium",
    },
    {
      question: "Who has the final authority to cancel a Sprint?",
      options: [
        "The scrum master",
        "The development team",
        "The product owner",
        "The stakeholders",
      ],
      correctAnswer: 2,
      explanation: "Only the Product Owner has the authority to cancel a Sprint, though they may be influenced by stakeholders or the team.",
      domain: "Scrum Roles",
      difficulty: "Easy",
    },
    {
      question: "What is the maximum time-box recommended for Sprint Planning in a one-month Sprint?",
      options: [
        "4 hours",
        "6 hours",
        "8 hours",
        "2 hours",
      ],
      correctAnswer: 2,
      explanation: "Sprint Planning is time-boxed to a maximum of 8 hours for a one-month Sprint.",
      domain: "Scrum Events & Artifacts",
      difficulty: "Medium",
    },
    {
      question: "What is the Product Backlog?",
      options: [
        "A detailed project plan for the entire product lifecycle",
        "An ordered list of everything that might be needed in the product",
        "A schedule of sprints for the next release",
        "The set of tasks for the current sprint",
      ],
      correctAnswer: 1,
      explanation: "The Product Backlog is an emergent, ordered list of what is needed to improve the product.",
      domain: "Scrum Fundamentals",
      difficulty: "Easy",
    },
    {
      question: "Which statement best describes a self-managing team in Scrum?",
      options: [
        "The team decides who does what, when, and how",
        "The scrum master assigns tasks daily",
        "The product owner directs the team's work",
        "The team follows a plan created by management",
      ],
      correctAnswer: 0,
      explanation: "Self-managing teams internally decide who does what, when, and how to best achieve their Sprint Goal.",
      domain: "Scrum Roles",
      difficulty: "Easy",
    },
  ],
  "six-sigma": [
    {
      question: "A Six Sigma team is defining a project to reduce invoice processing time. They have identified that invoices take an average of 12 days to process. What should they do first?",
      options: [
        "Implement software automation immediately",
        "Create a project charter with problem statement, scope, and goals",
        "Train all processing staff on lean principles",
        "Measure the current state and collect baseline data",
      ],
      correctAnswer: 1,
      explanation: "The Define phase of DMAIC starts with a project charter that clarifies the problem, scope, business case, and team before any measurement or action.",
      domain: "DMAIC",
      difficulty: "Easy",
    },
    {
      question: "A control chart for a manufacturing process shows seven consecutive points on the same side of the center line, but all within control limits. What should the team conclude?",
      options: [
        "The process is in control and no action is needed",
        "The process may be exhibiting a special cause pattern and should be investigated",
        "The control limits need to be recalculated",
        "The measurement system is faulty",
      ],
      correctAnswer: 1,
      explanation: "A run of seven or more points on one side of the center line is a Western Electric rule indicating a potential special cause, even if all points are within limits.",
      domain: "SPC",
      difficulty: "Medium",
    },
    {
      question: "A hospital wants to reduce patient wait times in the emergency department. After mapping the current process, they find that lab results take 45 minutes and bed assignments take 30 minutes. What lean waste do these delays represent?",
      options: [
        "Motion waste",
        "Transport waste",
        "Waiting waste",
        "Overproduction waste",
      ],
      correctAnswer: 2,
      explanation: "Waiting waste occurs when people or processes are idle due to delays in upstream steps. Lab results and bed assignments are classic waiting waste.",
      domain: "Lean",
      difficulty: "Easy",
    },
    {
      question: "A Gage R&R study for a critical dimension measurement yields 32% variation. The specification tolerance is ±0.5mm. What should the team do?",
      options: [
        "Proceed with data collection since the specification is wide enough",
        "Improve the measurement system — retrain operators and recalibrate gages, then reassess",
        "Reduce the sample size to lower measurement cost",
        "Average multiple measurements to compensate for variation",
      ],
      correctAnswer: 1,
      explanation: "A Gage R&R above 30% is unacceptable. The measurement system must be improved before data can be trusted for decisions.",
      domain: "MSA",
      difficulty: "Medium",
    },
    {
      question: "During the Analyze phase, the team has collected data and suspects that machine temperature is the root cause of defects. What statistical tool should they use to test this hypothesis?",
      options: [
        "A Pareto chart",
        "A control chart",
        "A hypothesis test (e.g., t-test or ANOVA)",
        "A SIPOC diagram",
      ],
      correctAnswer: 2,
      explanation: "The Analyze phase uses hypothesis testing to statistically confirm root causes. A Pareto chart prioritizes, a control chart monitors stability, and SIPOC is a Define phase tool.",
      domain: "DMAIC",
      difficulty: "Medium",
    },
    {
      question: "A factory stores raw materials in a warehouse where workers must walk 200 meters to retrieve frequently used items. What lean methodology should be applied first?",
      options: [
        "Value stream mapping",
        "5S workplace organization",
        "Poka-yoke (error proofing)",
        "Total Productive Maintenance (TPM)",
      ],
      correctAnswer: 1,
      explanation: "5S (Sort, Set in Order, Shine, Standardize, Sustain) organizes the workplace to reduce motion waste. Frequently used items should be stored closest to the point of use.",
      domain: "Lean",
      difficulty: "Easy",
    },
    {
      question: "After implementing a process improvement, the Six Sigma team needs to ensure the gains are sustained. What is the most important step?",
      options: [
        "Celebrate the team's success and move to the next project",
        "Create a control plan with monitoring, response procedures, and process documentation",
        "Increase inspection frequency to catch any regression",
        "Train new operators on the old process in case of issues",
      ],
      correctAnswer: 1,
      explanation: "The Control phase of DMAIC requires a control plan that defines how the process will be monitored, what actions to take if it drifts, and who is responsible.",
      domain: "DMAIC",
      difficulty: "Easy",
    },
    {
      question: "A process produces 20% more units than customer demand to 'be safe.' The extra inventory sits in storage for weeks. Which type of waste does this represent?",
      options: [
        "Transport waste",
        "Inventory waste",
        "Overproduction waste",
        "Defect waste",
      ],
      correctAnswer: 2,
      explanation: "Overproduction — making more than the customer needs — is considered the most serious lean waste because it hides other wastes and ties up capital in inventory.",
      domain: "Waste Reduction",
      difficulty: "Easy",
    },
    {
      question: "A SIPOC diagram has been created for an order fulfillment process. What is the purpose of the 'C' (Customers) column?",
      options: [
        "To list the people who work in the process",
        "To identify who receives the outputs of the process",
        "To define customer satisfaction survey results",
        "To show the suppliers of the process inputs",
      ],
      correctAnswer: 1,
      explanation: "In SIPOC, Customers are the recipients of the process outputs. They can be internal (next department) or external (end customers). Understanding customers is essential for defining value.",
      domain: "Process Mapping",
      difficulty: "Easy",
    },
    {
      question: "A process has Cp = 0.8 and all points are within control limits. What does this indicate?",
      options: [
        "The process is capable and in control",
        "The process is stable (in control) but not capable of meeting specifications",
        "The control limits are set too narrowly",
        "The specification limits are too wide",
      ],
      correctAnswer: 1,
      explanation: "Cp = 0.8 means the process variation is wider than the specification limits (Cp < 1.0). Even though the process is stable, it cannot consistently produce within specs.",
      domain: "SPC",
      difficulty: "Hard",
    },
  ],
};

export function getStarterQuestions(certSlug: string): StarterQuestion[] {
  return starterQuestions[certSlug] ?? starterQuestions.pmp;
}
