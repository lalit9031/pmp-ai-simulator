import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fallbackQuestion = {
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
  source: "fallback",
};

function parseQuestionJson(responseText: string) {
  const cleanedText = responseText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleanedText);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain") ?? "Mixed";
    const difficulty = searchParams.get("difficulty") ?? "Mixed";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        ...fallbackQuestion,
        warning: "OPENAI_API_KEY is not configured. Returned fallback question.",
      });
    }

    const prompt = `
Generate one PMP-style ${difficulty.toLowerCase()} question for ${domain} PMP practice.

Requirements:
- Scenario-based
- Agile, predictive, or hybrid project context as appropriate
- 4 options
- One correct answer
- Realistic PMI mindset
- Include concise explanation
- Include why each option is right or wrong
- Include a PMI mindset tip
- Include a short topic label for learning recommendation mapping
- Avoid trick wording; make the best answer defensible through PMP logic

Return ONLY valid JSON in this format:

{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 1,
  "explanation": "...",
  "whyOthersWrong": ["...", "...", "...", "..."],
  "mindsetTip": "...",
  "domain": "${domain}",
  "topic": "Risk Response Thinking",
  "difficulty": "${difficulty}"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
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

    return NextResponse.json({
      ...fallbackQuestion,
      warning:
        "OpenAI question generation failed. Returned fallback question instead.",
    });
  }
}
