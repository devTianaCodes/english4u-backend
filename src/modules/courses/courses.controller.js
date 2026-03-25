import { buildCourseDetail, buildUnitDetail, getCourseCatalog } from "../../utils/demo-data.js";

export function listCourses(_req, res) {
  res.json({
    items: getCourseCatalog()
  });
}

export function getCourse(req, res) {
  const course = buildCourseDetail(req.params.courseId);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.json(course);
}

export function listLevels(_req, res) {
  res.json({
    items: ["A1", "A2", "B1", "B2"]
  });
}

export function getUnit(req, res) {
  const unit = buildUnitDetail(req.params.unitId);

  if (!unit) {
    return res.status(404).json({ error: "Unit not found" });
  }

  return res.json(unit);
}
