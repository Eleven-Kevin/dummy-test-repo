import http from "node:http";
import { createCircuitRouter } from "./routes/circuitRoutes.js";
import { createStateRouter } from "./routes/stateRoutes.js";
import { createTutorRouter } from "./routes/tutorRoutes.js";
import { createExperimentRouter } from "./routes/experimentRoutes.js";
import { createLearningRouter } from "./routes/learningRoutes.js";

const PORT = process.env.PORT || 3000;

const circuit = createCircuitRouter();
const state = createStateRouter();
const tutor = createTutorRouter();
const experiment = createExperimentRouter();
const learning = createLearningRouter();

export const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  // Helper response wrapper
  const resHelper = {
    status: (code) => ({
      json: (data) => {
        res.writeHead(code, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      },
    }),
  };

  try {
    let body = {};
    if (method === "POST" || method === "PUT") {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString("utf-8");
      if (rawBody.trim().length > 0) {
        body = JSON.parse(rawBody);
      }
    }

    const reqHelper = { ...req, body };

    if (method === "POST" && url === "/circuit/build") {
      return circuit.routeHandler.handler(reqHelper, resHelper);
    }
    if (method === "POST" && url === "/state/bloch-sphere") {
      return state.routeHandler.handler(reqHelper, resHelper);
    }
    if (method === "POST" && url === "/tutor/explain") {
      return tutor.routeHandler.handler(reqHelper, resHelper);
    }
    if (method === "POST" && url === "/experiment/run") {
      return experiment.runHandler.handler(reqHelper, resHelper);
    }
    if (method === "GET" && url === "/experiment/list") {
      return experiment.listHandler.handler(reqHelper, resHelper);
    }
    if (method === "GET" && url === "/learning/paths") {
      return learning.getPathsHandler.handler(reqHelper, resHelper);
    }
    if (method === "POST" && url === "/learning/complete") {
      return learning.completeHandler.handler(reqHelper, resHelper);
    }

    // Default health check endpoint
    if (url === "/health" || url === "/") {
      return resHelper.status(200).json({
        status: "ok",
        app: "Quantum Computing Learning Simulator",
        version: "1.0.0",
      });
    }

    resHelper.status(404).json({ error: "Endpoint not found" });
  } catch (err) {
    console.error("Unhandled request error in server:", err);
    resHelper.status(500).json({ error: "Internal Server Error" });
  }
});

// Start listening if run directly
if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  server.listen(PORT, () => {
    console.log(`Quantum Computing Learning Simulator API running on http://localhost:${PORT}`);
  });
}

export default server;
