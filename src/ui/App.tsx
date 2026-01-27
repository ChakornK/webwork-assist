import { Fragment } from "preact";
import { useState } from "preact/hooks";
import { Unpoison } from "../lib/unpoison";
import { solve } from "../lib/solver";

export default function App() {
  return (
    <Fragment>
      <Unpoison />
      <SolveButton />
    </Fragment>
  );
}

function SolveButton() {
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
