import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`English4U backend listening on http://localhost:${env.port}`);
});
