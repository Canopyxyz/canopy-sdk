import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

// Movement SDK touches `process.env` in a browser context — shim it before app loads.
if (!("process" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).process = { env: {} };
}

async function bootstrap(): Promise<void> {
  const { default: App } = await import("./App");
  const queryClient = new QueryClient();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

void bootstrap();
