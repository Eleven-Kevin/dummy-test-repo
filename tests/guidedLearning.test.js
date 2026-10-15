import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { GuidedLearningPathService } from "../src/services/guidedLearningPathService.js";

describe("Guided Learning Path Navigator Tests", () => {
  const service = new GuidedLearningPathService();

  test("retrieves guided learning paths with progress percentages", () => {
    const paths = service.getLearningPaths();
    assert.ok(Array.isArray(paths));
    assert.equal(paths.length, 3);

    const firstPath = paths[0];
    assert.equal(firstPath.id, "path_01");
    assert.equal(typeof firstPath.progressPercentage, "number");
    assert.ok(firstPath.modules.length >= 3);
  });

  test("completing a module updates progress accurately", () => {
    const update = service.completeModule("path_01", "mod_03");
    assert.equal(update.success, true);
    assert.equal(update.completed, true);

    const paths = service.getLearningPaths();
    const firstPath = paths.find((p) => p.id === "path_01");
    assert.equal(firstPath.progressPercentage, 100);
  });
});
