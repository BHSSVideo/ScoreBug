import { App } from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@fontsource/roboto-condensed";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
        fontFamily: "Roboto Condensed",
        headings: { fontFamily: "Roboto Condensed" },
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
