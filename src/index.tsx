import { render } from "solid-js/web";
import App from "./ui/App";

// @ts-ignore
import appStyles from "./ui/app.css" with { type: "css" };
// @ts-ignore
import globalStyles from "./ui/global.css" with { type: "css" };

const observer = new MutationObserver(() => {
  const injectionTarget = document.querySelector(".sticky-nav");
  if (!injectionTarget) return;
  observer.disconnect();

  // Check if we're on a problem page
  if (!document.querySelector("#breadcrumb-navigation .breadcrumb-item:nth-child(4)")) return;

  const root = document.createElement("div");
  injectionTarget.appendChild(root);
  const shadowRoot = root.attachShadow({ mode: "closed" });

  const appStyleSheet = new CSSStyleSheet();
  appStyleSheet.replaceSync(appStyles);
  shadowRoot.adoptedStyleSheets = [appStyleSheet];

  const globalStyleSheet = new CSSStyleSheet();
  globalStyleSheet.replaceSync(globalStyles);
  document.adoptedStyleSheets.push(globalStyleSheet);

  render(() => <App />, shadowRoot);
});
observer.observe(document.documentElement, { childList: true, subtree: true });
