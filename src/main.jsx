import React from "react";
import { App } from "./App.jsx";

/**
 * Client application bootstrap entry point.
 */
export function mountApplication() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    // In production React 18+: ReactDOM.createRoot(rootElement).render(<App />);
    return <App />;
  }
  return null;
}

export default mountApplication;
