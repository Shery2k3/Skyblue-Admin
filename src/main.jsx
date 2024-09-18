import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext/AuthContext.jsx";
import { ConfigProvider } from "antd";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Descriptions: {
            labelBg: "rgb(183,226,243)",
          },
          Table: {
            headerBg: "rgb(183,226,243)",
          },
          Card: {
            boxShadowCard:
              "    0 2px 4px -1px rgba(0, 0, 0, 0.2),      0 6px 12px 0 rgba(0, 0, 0, 0.15),      0 10px 24px 8px rgba(0, 0, 0, 0.12)",
            boxShadowTertiary:
              "    0 2px 4px 0 rgba(0, 0, 0, 0.06),      0 2px 8px -1px rgba(0, 0, 0, 0.04),      0 4px 8px 0 rgba(0, 0, 0, 0.04)",
          },
        },
        token: {
          colorPrimary: "#00779b",
          colorInfo: "#00779b",
        },
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </StrictMode>
);
