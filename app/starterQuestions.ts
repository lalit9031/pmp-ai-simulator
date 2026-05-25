/**
 * Starter question banks for each certification.
 * Used as initial questions before AI-generated ones load.
 */

import type { CertSlug } from "./certifications";

export type StarterQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain?: string;
  difficulty?: string;
};

export const starterQuestions: Record<string, StarterQuestion[]> = {
  pmp: [
    {
      question: "A hybrid team is split between frequent backlog changes and fixed compliance deliverables. What should the project manager do first?",
      options: [
        "Escalate the conflict to the sponsor",
        "Facilitate alignment on delivery approach, constraints, and change handling",
        "Freeze all backlog changes until compliance work is complete",
        "Update the charter to require a predictive approach",
      ],
      correctAnswer: 1,
      explanation: "The project manager should first create shared understanding and agree on how change will be handled across the hybrid work.",
      domain: "Hybrid",
      difficulty: "Medium",
    },
    {
      question: "A vendor dependency may delay a critical sprint goal. The team is frustrated and the product owner wants an immediate workaround. What should the project manager do?",
      options: [
        "Ask the team to inspect options, risks, and tradeoffs with the product owner",
        "Tell the vendor to add resources at no cost",
        "Remove the affected story from the release plan",
        "Escalate the issue before discussing it with the team",
      ],
      correctAnswer: 0,
      explanation: "PMI mindset favors collaboration and informed decision-making before escalation or unilateral scope changes.",
      domain: "Risk",
      difficulty: "Medium",
    },
    {
      question: "A stakeholder keeps bypassing the product owner and assigning urgent work directly to developers. What should the project manager do first?",
      options: [
        "Ask developers to ignore the stakeholder",
        "Update the communications management plan and reinforce the intake process",
        "Escalate the behavior to the steering committee",
        "Add the new work to the sprint backlog immediately",
      ],
      correctAnswer: 1,
      explanation: "The project manager should protect the team and clarify governance while maintaining stakeholder engagement.",
      domain: "Stakeholder",
      difficulty: "Easy",
    },
    {
      question: "During a retrospective, several team members say testing is always rushed near the end of each iteration. What is the best response?",
      options: [
        "Ask the quality team to test after the sprint ends",
        "Increase sprint length without team discussion",
        "Help the team identify root causes and define improvement actions",
        "Document the issue as accepted risk",
      ],
      correctAnswer: 2,
      explanation: "Retrospectives are used for continuous improvement owned by the team.",
      domain: "Agile",
      difficulty: "Easy",
    },
    {
      question: "The sponsor asks for a feature that will likely push the release past a regulatory deadline. What is the best next step?",
      options: [
        "Accept the request because it came from the sponsor",
        "Reject the request to protect the deadline",
        "Analyze impact with the team and product owner before deciding",
        "Move the regulatory work to a later release",
      ],
      correctAnswer: 2,
      explanation: "Change requests should be assessed for impact before approval or rejection.",
      domain: "Business Environment",
      difficulty: "Hard",
    },
    {
      question: "A team member reports that a senior stakeholder is pressuring them to skip an approval step. What should the project manager do first?",
      options: [
        "Privately support the team member and address the governance concern with the stakeholder",
        "Tell the team member to follow the stakeholder's direction",
        "Cancel the approval process permanently",
        "Ignore the issue unless it becomes public",
      ],
      correctAnswer: 0,
      explanation: "The project manager should protect the team and uphold governance with respectful stakeholder engagement.",
      domain: "Stakeholder",
      difficulty: "Medium",
    },
    {
      question: "A key stakeholder rejects a delivered increment because it does not match an assumption that was never documented. What should the project manager do?",
      options: [
        "Review acceptance criteria and facilitate agreement on the needed change",
        "Tell the stakeholder the increment must be accepted",
        "Replace the product owner",
        "Immediately rework the increment without impact analysis",
      ],
      correctAnswer: 0,
      explanation: "Clarify acceptance criteria and manage the change through the appropriate process.",
      domain: "Stakeholder",
      difficulty: "Medium",
    },
    {
      question: "The team discovers an opportunity to automate a manual control, reducing long-term cost but adding short-term work. What should the project manager do?",
      options: [
        "Reject it because it was not in the original plan",
        "Assess benefits, risks, and priority with the product owner and stakeholders",
        "Approve it immediately because automation is always valuable",
        "Ask the team to do it without reporting the impact",
      ],
      correctAnswer: 1,
      explanation: "Opportunities should be evaluated and prioritized like other changes.",
      domain: "Risk",
      difficulty: "Medium",
    },
    {
      question: "A lessons learned item from a previous project is relevant, but the team has not reviewed it. What should the project manager do?",
      options: [
        "Share relevant lessons and discuss how they affect current planning",
        "Wait until project closure",
        "Assume the team already knows",
        "File the lessons in the repository only",
      ],
      correctAnswer: 0,
      explanation: "Lessons learned should be used throughout the project, not only at the end.",
      domain: "Agile",
      difficulty: "Easy",
    },
    {
      question: "A customer requests daily status meetings because they do not trust the team's progress. What should the project manager do?",
      options: [
        "Decline the request without discussion",
        "Invite the customer to sprint reviews and agree on transparent reporting",
        "Ask the team to prepare detailed daily slide decks",
        "Escalate the trust issue to procurement",
      ],
      correctAnswer: 1,
      explanation: "Transparency and appropriate ceremonies can address trust without creating unnecessary overhead.",
      domain: "Agile",
      difficulty: "Easy",
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
};

export function getStarterQuestions(certSlug: string): StarterQuestion[] {
  return starterQuestions[certSlug] ?? starterQuestions.pmp;
}
