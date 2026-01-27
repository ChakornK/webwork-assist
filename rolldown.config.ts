import { execSync } from "node:child_process";

import { defineConfig } from "rolldown";

import postcss from "postcss";
// @ts-ignore
import tailwindPostcss from "@tailwindcss/postcss";
import { transform } from "lightningcss";

const gitHash = (() => {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "unknown";
  }
})();

const userScriptMetadata = `// ==UserScript==
// @name        WebWork Assist
// @namespace   Violentmonkey Scripts
// @match       https://webwork.*/webwork2/*
// @version     ${process.env.VERSION || "1.0.0"}
// @author      -
// @description Build ${gitHash} - ${new Date().toLocaleString("en")}
// @downloadURL https://github.com/chakornk/webwork-assist/releases/latest/download/webwork-assist.user.js
// @updateURL   https://github.com/chakornk/webwork-assist/releases/latest/download/webwork-assist.user.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addValueChangeListener
// ==/UserScript==`;

export default defineConfig({
  input: "src/index.tsx",
  output: {
    cleanDir: true,
    file: "dist/webwork-assist.user.js",
    format: "iife",
    minify: true,
    postBanner: userScriptMetadata,
  },
  moduleTypes: {
    ".css": "text",
  },
  plugins: [
    {
      name: "postcss",
      transform: async (code: string, id: string) => {
        if (!id.endsWith(".css")) return null;
        const processed: string = await new Promise((resolve) => {
          postcss([tailwindPostcss])
            .process(code, {
              from: "src/ui/index.css",
            })
            .then((result) => {
              resolve(result.css);
            });
        });
        const { code: minified } = transform({
          filename: id,
          code: Buffer.from(processed),
          minify: true,
        });
        const cleaned = minified
          .toString()
          .replaceAll(/\/\*!.*?\//g, "")
          .trim();
        return cleaned;
      },
    },
  ],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
});
