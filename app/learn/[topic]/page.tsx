import { notFound } from "next/navigation";
import { learningTopics } from "../../learningTopics";
import TopicAccessGate from "./TopicAccessGate";

export function generateStaticParams() {
  return Object.keys(learningTopics).map((topic) => ({ topic }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = learningTopics[topicSlug];

  if (!topic) {
    notFound();
  }

  return <TopicAccessGate topic={topic} />;
}
