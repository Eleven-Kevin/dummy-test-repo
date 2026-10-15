# Architecture & Technical Design Notes

## Overview
The **Quantum Computing Learning Simulator** is structured using a clean 4-tier modular architecture:
1. **User Interface Tier**: React components located in `src/components/`, enabling interactive quantum circuit editing, SVG Bloch sphere rendering, AI tutor interaction, experiment execution, and learning path navigation.
2. **API & Routing Tier**: RESTful endpoints defined in `src/routes/` and served via `src/server.js`, handling request validation and payload dispatching.
3. **Domain Business Logic Tier**: Pure services in `src/services/` performing mathematical quantum state transformations, linear algebra operations (matrix-vector multiplication, Kronecker tensor products), Bloch sphere spherical angle calculation, and Monte Carlo sampling.
4. **Data & State Modeling Tier**: Models in `src/models/` defining state representations, probability calculations, and system schemas.

## Component Architecture Flow

```mermaid
flowchart TD
    Client["React Frontend (App.jsx)"]
    
    subgraph UI_Layer ["User Interface Components"]
        UI_Circuit["QuantumCircuitBuilder.jsx"]
        UI_Bloch["BlochSphereVisualizer.jsx"]
        UI_Tutor["AiTutorInterface.jsx"]
        UI_Experiment["ExperimentModeWorkspace.jsx"]
        UI_Learning["LearningPathNavigator.jsx"]
    end

    subgraph Route_Layer ["API & Route Handlers"]
        R_Circuit["circuitRoutes.js (/circuit/build)"]
        R_State["stateRoutes.js (/state/bloch-sphere)"]
        R_Tutor["tutorRoutes.js (/tutor/explain)"]
        R_Experiment["experimentRoutes.js (/experiment/run)"]
        R_Learning["learningRoutes.js (/learning/paths)"]
    end

    subgraph Service_Layer ["Domain Logic Services"]
        S_Circuit["QuantumCircuitBuilderService"]
        S_Bloch["BlochSphereStateVisualizerService"]
        S_Tutor["AiTutorConceptExplainerService"]
        S_Experiment["ExperimentModeRunnerService"]
        S_Learning["GuidedLearningPathService"]
    end

    subgraph Model_Layer ["Data & State Model"]
        M_State["QuantumStateModel (Amplitudes & Probabilities)"]
    end

    Client --> UI_Layer
    UI_Circuit --> R_Circuit
    UI_Bloch --> R_State
    UI_Tutor --> R_Tutor
    UI_Experiment --> R_Experiment
    UI_Learning --> R_Learning

    R_Circuit --> S_Circuit
    R_State --> S_Bloch
    R_Tutor --> S_Tutor
    R_Experiment --> S_Experiment
    R_Learning --> S_Learning

    S_Circuit --> M_State
    S_Bloch --> M_State
    S_Experiment --> S_Circuit
```

## Security & Reliability Hardening
- **Zero Secrets**: All configurations are environment-parameterized with `.env.example`. No keys or tokens are stored in source.
- **Input Validation Boundaries**: Every endpoint validates input types (qubit count, gate array structure, questions, and shots bounds) in `src/utils/validator.js`.
- **Zero Dangerous Sinks**: No dynamic `eval()` or unparameterized command injection patterns are used.
- **Robust Error Handling**: Explicit `try ... catch (err)` blocks log diagnostics and return structured JSON error responses.
