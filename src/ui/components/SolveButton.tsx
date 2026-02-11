import { createSignal } from "solid-js";
import { solve } from "../../lib/solver";
import { createGmStorage } from "src/hooks/createGmStorage";

export default function SolveButton() {
  const [msg, setMsg] = createSignal("");
  const [disabled, setDisabled] = createSignal(false);

  const [geminiApiKey] = createGmStorage("geminiApiKey", "", false);
  const [geminiKeyIndex, setGeminiKeyIndex] = createGmStorage("geminiKeyIndex", 0, false);
  const [blacklistedKeys, setBlacklistedKeys] = createSignal([]);

  return (
    <button
      class={"btn"}
      disabled={disabled()}
      on:click={() => {
        if (disabled()) return;
        setDisabled(true);
        try {
          const gk = geminiApiKey();
          solve({
            geminiApiKey: gk.includes(",") ? gk.split(",")[geminiKeyIndex()].trim() : gk,
            onProgressUpdate: (status) => {
              setMsg(status);
            },
            onFinish: (success, message) => {
              let retry = false;
              if (!success) {
                if (
                  message.includes("Quota exceeded") &&
                  gk.includes(",") &&
                  gk.split(",").filter((k: string) => !blacklistedKeys().includes(k.trim())).length > 0
                ) {
                  setBlacklistedKeys((old) => [...old, gk.split(",")[geminiKeyIndex()].trim()]);
                  retry = true;
                } else {
                  alert(`Something went wrong: ${message}\nCheck the console for more info`);
                }
              }
              setMsg("");
              setDisabled(false);

              if (!gk.includes(",")) return;

              let newKeyIndex = (geminiKeyIndex() + 1) % gk.split(",").length;
              while (blacklistedKeys().includes(gk.split(",")[newKeyIndex].trim())) {
                newKeyIndex += 1;
              }
              setGeminiKeyIndex(newKeyIndex);

              if (retry) {
                setTimeout(() => {
                  try {
                    this.base.click();
                  } catch {}
                }, 50);
              }
            },
          });
        } catch (e) {
          alert(`Something went wrong: ${e}\nCheck the console for more info`);
          setMsg("");
          setDisabled(false);
        }
      }}
    >
      {msg() || "WebWork Assist"}
    </button>
  );
}
