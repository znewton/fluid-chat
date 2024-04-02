import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Render app
const container = document.getElementById("app");
if (!container) {
	throw new Error('Could not find root "app" element.');
}
const root = createRoot(container);
root.render(<App />);
