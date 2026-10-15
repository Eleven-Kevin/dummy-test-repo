import { BlochSphereStateVisualizerService } from "../services/blochSphereStateVisualizerService.js";

const visualizerService = new BlochSphereStateVisualizerService();

export function createStateRouter() {
  const router = {
    post: (path, handler) => ({ method: "POST", path, handler }),
  };

  const routeHandler = router.post("/state/bloch-sphere", async (req, res) => {
    try {
      const alpha = req.body?.alpha || { re: 1, im: 0 };
      const beta = req.body?.beta || { re: 0, im: 0 };
      const result = visualizerService.visualizeBlochSphere(alpha, beta);
      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to compute Bloch sphere state visualization:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  });

  return { routeHandler, visualizerService };
}

export default createStateRouter;
