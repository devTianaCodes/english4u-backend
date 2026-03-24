export function getLesson(req, res) {
  res.json({
    id: req.params.lessonId,
    title: "Talking about daily routines",
    blocks: [
      { type: "reading", title: "Morning routine" },
      { type: "grammar", title: "Simple present verbs" },
      { type: "vocabulary", title: "Time expressions" }
    ]
  });
}
