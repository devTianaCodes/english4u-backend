import { dashboardSnapshot } from "../../utils/demo-data.js";

export function getDashboard(req, res) {
  res.json({
    ...dashboardSnapshot,
    learner: req.user
      ? {
          id: req.user.id,
          name: `${req.user.firstName} ${req.user.lastName}`.trim(),
          role: req.user.role
        }
      : dashboardSnapshot.learner
  });
}
