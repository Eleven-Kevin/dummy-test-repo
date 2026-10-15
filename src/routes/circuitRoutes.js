import { QuantumCircuitBuilderService } from "../services/quantumCircuitBuilderService.js";
import { validateCircuitPayload } from "../utils/validator.js";

const circuitService = new QuantumCircuitBuilderService();

export function createCircuitRouter() {
  const router = {
    post: (path, handler) => ({ method: "POST", path, handler }),
  };

  const routeHandler = router.post("/circuit/build", async (req, res) => {
    try {
      const validated = validateCircuitPayload(req.body);
      const result = circuitService.buildCircuit(validated.qubitCount, validated.gates);
      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to build quantum circuit:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return { routeHandler, circuitService };
}

export default createCircuitRouter;
