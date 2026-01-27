import { Fragment } from "preact";
import { useState } from "preact/hooks";
import { Unpoison } from "../lib/unpoison";
import SolveButton from "./components/SolveButton";
import SettingsButton from "./components/SettingsButton";
import SettingsModal from "./components/SettingsModal";

export default function App() {
  return (
    <Fragment>
      <Unpoison />
      <UiButtons />
    </Fragment>
  );
}

function UiButtons() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Fragment>
      <div class={"flex gap-1"}>
        <SolveButton />
        <SettingsButton onClick={() => setSettingsOpen(true)} />
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </Fragment>
  );
}
