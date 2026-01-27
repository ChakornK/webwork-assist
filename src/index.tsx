import { render } from "preact";
import App from "./ui/App";

// @ts-ignore
import styles from "./ui/index.css" with { type: "css" };

const observer = new MutationObserver(() => {
  const injectionTarget = document.querySelector(".sticky-nav");
  if (!injectionTarget) return;
  observer.disconnect();

  // Check if we're on a problem page
  if (!document.querySelector("#breadcrumb-navigation .breadcrumb-item:nth-child(4)")) return;

  const root = document.createElement("div");
  injectionTarget.appendChild(root);
  const shadowRoot = root.attachShadow({ mode: "closed" });

  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(styles);
  shadowRoot.adoptedStyleSheets = [stylesheet];

  render(<App />, shadowRoot);
});
observer.observe(document.documentElement, { childList: true, subtree: true });
