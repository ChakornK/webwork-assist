import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

import { defineConfig } from "rolldown";
import solid from "@rolldown-plugin/solid";

import postcss from "postcss";
import { createPlugin as postcssUno } from "@unocss/postcss/esm";
import postcssImport from "postcss-import";

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
// @homepageURL https://github.com/chakornk/webwork-assist
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
    solid(),
    {
      name: "postcss",
      transform: async (code: string, id: string) => {
        if (!id.endsWith(".css")) return null;
        const processed: string = await new Promise((resolve) => {
          postcss([postcssUno({}), postcssImport()])
            .process(code, {
              from: id,
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
          .replaceAll(/\/\*!.*?\*\//g, "")
          .trim();

        if (!existsSync(`${process.cwd()}/dist/debug`)) {
          mkdirSync(`${process.cwd()}/dist/debug`, { recursive: true });
        }
        writeFileSync(`${process.cwd()}/dist/debug/${id.split(/\/|\\/).pop()}`, cleaned);

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
