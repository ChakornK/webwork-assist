import { useState } from "preact/hooks";
import { solve } from "../../lib/solver";
import { useStorage } from "src/hooks/useStorage";

export default function SolveButton() {
  const [msg, setMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [geminiApiKey] = useStorage("geminiApiKey", "", false);

  return (
    <button
      class={"btn"}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        setDisabled(true);
        try {
          solve({
            geminiApiKey,
            onProgressUpdate: (status) => {
              setMsg(status);
            },
            onFinish: (success, message) => {
              if (!success) {
                alert(`Something went wrong: ${message}\nCheck the console for more info`);
              }
              setMsg("");
              setDisabled(false);
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
