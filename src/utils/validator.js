/**
 * Input validation utilities for Quantum Computing Learning Simulator API.
 */

export function isString(val) {
  return typeof val === "string" && val.trim().length > 0;
}

export function isNumber(val) {
  return typeof val === "number" && !Number.isNaN(val) && Number.isFinite(val);
}

export function validateCircuitPayload(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request: payload body must be an object.");
  }
  const qubitCount = body.qubitCount ?? 2;
  if (!isNumber(qubitCount) || qubitCount < 1 || qubitCount > 8) {
    throw new Error("Validation Error: qubitCount must be a number between 1 and 8.");
  }
  if (body.gates && !Array.isArray(body.gates)) {
    throw new Error("Validation Error: gates must be an array of quantum gate operations.");
  }
  return {
    qubitCount,
    gates: body.gates || [],
  };
}

export function validateStateVector(stateVector) {
  if (!Array.isArray(stateVector) || stateVector.length < 2) {
    throw new Error("Validation Error: stateVector must be an array with at least 2 amplitudes.");
  }
  return stateVector;
}

export function validateQuestionPayload(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request: payload body must be an object.");
  }
  if (!isString(body.question)) {
    throw new Error("Validation Error: question is required and must be a non-empty string.");
  }
  return {
    question: body.question.trim(),
    topic: isString(body.topic) ? body.topic.trim() : "general",
  };
}

export function validateExperimentPayload(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request: payload body must be an object.");
  }
  const experimentType = body.experimentType || "bell_state";
  const shots = body.shots ?? 1024;
  if (!isNumber(shots) || shots < 1 || shots > 100000) {
    throw new Error("Validation Error: shots must be a number between 1 and 100,000.");
  }
  return {
    experimentType,
    shots,
  };
}
