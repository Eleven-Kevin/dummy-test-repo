import { ExperimentModeRunnerService } from "../services/experimentModeRunnerService.js";
import { validateExperimentPayload } from "../utils/validator.js";

const experimentRunner = new ExperimentModeRunnerService();

export function createExperimentRouter() {
  const router = {
    post: (path, handler) => ({ method: "POST", path, handler }),
    get: (path, handler) => ({ method: "GET", path, handler }),
  };

  const runHandler = router.post("/experiment/run", async (req, res) => {
    try {
      const validated = validateExperimentPayload(req.body);
      const result = experimentRunner.runExperiment(validated.experimentType, validated.shots);
      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to run experiment mode:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  const listHandler = router.get("/experiment/list", async (req, res) => {
    try {
      const list = experimentRunner.listExperiments();
      res.status(200).json({ success: true, experiments: list });
    } catch (err) {
      console.error("Failed to list experiments:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return { runHandler, listHandler, experimentRunner };
}

export default createExperimentRouter;
