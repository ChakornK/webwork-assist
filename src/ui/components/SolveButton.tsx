import { useState } from "preact/hooks";
import { solve } from "../../lib/solver";
import { useStorage } from "src/hooks/useStorage";

export default function SolveButton() {
  const [msg, setMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [geminiApiKey] = useStorage("geminiApiKey", "", false);
  const [geminiKeyIndex, setGeminiKeyIndex] = useStorage("geminiKeyIndex", 0, false);
  const [blacklistedKeys, setBlacklistedKeys] = useState([]);

  return (
    <button
      class={"btn"}
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        setDisabled(true);
        try {
          solve({
            geminiApiKey: geminiApiKey.includes(",") ? geminiApiKey.split(",")[geminiKeyIndex].trim() : geminiApiKey,
            onProgressUpdate: (status) => {
              setMsg(status);
            },
            onFinish: (success, message) => {
              let retry = false;
              if (!success) {
                if (
                  message.includes("Quota exceeded") &&
                  geminiApiKey.includes(",") &&
                  geminiApiKey.split(",").filter((k: string) => !blacklistedKeys.includes(k.trim())).length > 0
                ) {
                  setBlacklistedKeys((old) => [...old, geminiApiKey.split(",")[geminiKeyIndex].trim()]);
                  retry = true;
                } else {
                  alert(`Something went wrong: ${message}\nCheck the console for more info`);
                }
              }
              setMsg("");
              setDisabled(false);

              if (!geminiApiKey.includes(",")) return;

              let newKeyIndex = (geminiKeyIndex + 1) % geminiApiKey.split(",").length;
              while (blacklistedKeys.includes(geminiApiKey.split(",")[newKeyIndex].trim())) {
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
      {msg || "WebWork Assist"}
    </button>
  );
}
