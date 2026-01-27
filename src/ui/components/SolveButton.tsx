import { useState } from "preact/hooks";
import { solve } from "../../lib/solver";

export default function SolveButton() {
  const [msg, setMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <button
      class={"btn"}
      disabled={disabled}
      onClick={() => {
        setDisabled(true);
        solve({
          geminiApiKey: "",
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
          preview: true,
        });
      }}
    >
      {msg || "WebWork Assist"}
    </button>
  );
}
