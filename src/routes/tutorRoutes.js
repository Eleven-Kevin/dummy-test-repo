import { AiTutorConceptExplainerService } from "../services/aiTutorConceptExplainerService.js";
import { validateQuestionPayload } from "../utils/validator.js";

const tutorService = new AiTutorConceptExplainerService();

export function createTutorRouter() {
  const router = {
    post: (path, handler) => ({ method: "POST", path, handler }),
  };

  const routeHandler = router.post("/tutor/explain", async (req, res) => {
    try {
      const validated = validateQuestionPayload(req.body);
      const result = tutorService.explainConcept(validated.topic, validated.question);
      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to generate AI tutor explanation:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return { routeHandler, tutorService };
}

export default createTutorRouter;
