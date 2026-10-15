/**
 * Service for Guided Learning Path curriculum navigation and progress tracking.
 */
export class GuidedLearningPathService {
  constructor() {
    this.paths = [
      {
        id: "path_01",
        title: "Quantum Fundamentals: The Qubit and Superposition",
        difficulty: "Beginner",
        estimatedMinutes: 30,
        modules: [
          { id: "mod_01", title: "What is a Qubit?", completed: true },
          { id: "mod_02", title: "Applying the Hadamard Gate", completed: true },
          { id: "mod_03", title: "Understanding Measurement Collapse", completed: false },
        ],
      },
      {
        id: "path_02",
        title: "Entanglement and Multi-Qubit Circuits",
        difficulty: "Intermediate",
        estimatedMinutes: 45,
        modules: [
          { id: "mod_04", title: "Two-Qubit State Vectors", completed: false },
          { id: "mod_05", title: "Building the Bell State |Φ⁺⟩", completed: false },
          { id: "mod_06", title: "Quantum Teleportation Basics", completed: false },
        ],
      },
      {
        id: "path_03",
        title: "Quantum Algorithms and Real-World Applications",
        difficulty: "Advanced",
        estimatedMinutes: 60,
        modules: [
          { id: "mod_07", title: "Deutsch-Jozsa Algorithm", completed: false },
          { id: "mod_08", title: "Grover's Search Algorithm", completed: false },
        ],
      },
    ];
  }

  getLearningPaths() {
    try {
      return this.paths.map((p) => {
        const total = p.modules.length;
        const completed = p.modules.filter((m) => m.completed).length;
        const progressPercentage = Math.round((completed / total) * 100);
        return {
          ...p,
          progressPercentage,
        };
      });
    } catch (err) {
      console.error("Error in GuidedLearningPathService.getLearningPaths:", err);
      throw err;
    }
  }

  completeModule(pathId, moduleId) {
    try {
      const targetPath = this.paths.find((p) => p.id === pathId);
      if (!targetPath) {
        throw new Error(`Path ${pathId} not found.`);
      }
      const targetMod = targetPath.modules.find((m) => m.id === moduleId);
      if (!targetMod) {
        throw new Error(`Module ${moduleId} not found in path ${pathId}.`);
      }
      targetMod.completed = true;
      return { success: true, pathId, moduleId, completed: true };
    } catch (err) {
      console.error("Error in GuidedLearningPathService.completeModule:", err);
      throw err;
    }
  }
}
