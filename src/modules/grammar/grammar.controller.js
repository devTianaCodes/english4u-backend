import { buildLesson } from "../../utils/demo-data.js";
import { getGrammarTopicById, getGrammarTopics } from "../../utils/grammar-library.js";

function mapTopicSummary(topic) {
  return {
    id: topic.id,
    level: topic.level,
    title: topic.title,
    summary: topic.summary,
    lessonCount: topic.relatedLessonIds.length
  };
}

function mapRelatedLessons(topic) {
  return topic.relatedLessonIds.map((lessonId) => {
    const lesson = buildLesson(lessonId);

    return {
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      courseId: lesson.courseId,
      courseTitle: lesson.courseTitle
    };
  });
}

export function getGrammarTopicsList(req, res) {
  const topics = getGrammarTopics().map(mapTopicSummary);
  res.json({ topics });
}

export function getGrammarTopic(req, res) {
  const topic = getGrammarTopicById(req.params.topicId);

  if (!topic) {
    return res.status(404).json({ error: "Grammar topic not found" });
  }

  return res.json({
    ...mapTopicSummary(topic),
    rules: topic.rules,
    examples: topic.examples,
    coachNote: topic.coachNote,
    relatedLessons: mapRelatedLessons(topic)
  });
}
