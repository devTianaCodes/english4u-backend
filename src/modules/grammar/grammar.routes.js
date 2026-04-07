import { Router } from "express";
import { getGrammarTopic, getGrammarTopicsList } from "./grammar.controller.js";

const router = Router();

router.get("/", getGrammarTopicsList);
router.get("/:topicId", getGrammarTopic);

export default router;
