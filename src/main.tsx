import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Font
import greyCliff from "./aset/font/GreycliffCF-Regular.woff2";
import {
  MantineProvider, // Theme Provider Mantine
  Global, // Global Style
  rem, // rem komponen
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import LogRocket from "logrocket";
// Aplikasi
import App from "./App.tsx";

// USER IMPORT
// State Store
import { store, persistor } from "./state/store";

LogRocket.init("thf2su/e-report");

// Definisi Style
function TemaAplikasi() {
  return (
    <Global
      styles={(theme) => ({
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },

        body: {
          ...theme.fn.fontStyles(),
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          lineHeight: theme.lineHeight,
        },

        ".your-class": {
          backgroundColor: "red",
        },

        "#your-id > [data-active]": {
          backgroundColor: "pink",
        },

        "@font-face": {
          fontFamily: "Greycliff CF",
          src: `url('${greyCliff}') format("woff2")`,
          fontWeight: 700,
          fontStyle: "normal",
        },
      })}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <MantineProvider
          theme={{
            colorScheme: "dark",
            fontFamily: "Greycliff CF",
            focusRingStyles: {
              resetStyles: () => ({ outline: "none" }),
              inputStyles: (theme) => ({
                outline: `${rem(1)} solid ${theme.colors.orange[7]}`,
              }),
            },
            activeStyles: { transform: "scale(0.95)" },
            cursorType: "pointer",
            primaryColor: "orange",
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Notifications position="bottom-right" zIndex={2077} />
          <TemaAplikasi />
          <App />
        </MantineProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
