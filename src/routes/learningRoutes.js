import { GuidedLearningPathService } from "../services/guidedLearningPathService.js";

const learningService = new GuidedLearningPathService();

export function createLearningRouter() {
  const router = {
    get: (path, handler) => ({ method: "GET", path, handler }),
    post: (path, handler) => ({ method: "POST", path, handler }),
  };

  const getPathsHandler = router.get("/learning/paths", async (req, res) => {
    try {
      const paths = learningService.getLearningPaths();
      res.status(200).json({ success: true, paths });
    } catch (err) {
      console.error("Failed to fetch guided learning paths:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  const completeHandler = router.post("/learning/complete", async (req, res) => {
    try {
      const { pathId, moduleId } = req.body || {};
      const result = learningService.completeModule(pathId, moduleId);
      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to complete guided learning module:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return { getPathsHandler, completeHandler, learningService };
}

export default createLearningRouter;
