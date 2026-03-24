import { dashboardSnapshot } from "../../utils/demo-data.js";

export function getDashboard(_req, res) {
  res.json(dashboardSnapshot);
}
