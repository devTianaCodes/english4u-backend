import { courseCatalog } from "../../utils/demo-data.js";

export function listCourses(_req, res) {
  res.json({
    items: courseCatalog
  });
}

export function getCourse(req, res) {
  const course = courseCatalog.find((item) => item.id === req.params.courseId);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.json({
    ...course,
    units: [
      { id: `${course.id}-unit-1`, title: "Introductions and basics" },
      { id: `${course.id}-unit-2`, title: "Daily routines" }
    ]
  });
}

export function listLevels(_req, res) {
  res.json({
    items: ["A1", "A2", "B1", "B2"]
  });
}

export function getUnit(req, res) {
  res.json({
    id: req.params.unitId,
    lessons: [
      { id: `${req.params.unitId}-lesson-1`, title: "Warm-up and vocabulary" },
      { id: `${req.params.unitId}-lesson-2`, title: "Grammar focus" }
    ]
  });
}
