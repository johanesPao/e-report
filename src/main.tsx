import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// Font
import boldGreyCliff from "./aset/font/GreycliffCF-Bold.woff2";
import {
  MantineProvider, // Theme Provider Mantine
  Global, // Global Style
  rem, // rem komponen
} from "@mantine/core";
// Aplikasi
import App from "./App.tsx";

// USER IMPORT
// State Store
import { store } from "./state/store";

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
          src: `url('${boldGreyCliff}') format("woff2")`,
          fontWeight: 700,
          fontStyle: "normal",
        },
      })}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
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
          <TemaAplikasi />
          <App />
        </MantineProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
