import { buildLesson } from "../../utils/demo-data.js";

export function getLesson(req, res) {
  res.json(buildLesson(req.params.lessonId));
}
