import { createSignal } from "solid-js";
import { Unpoison } from "../lib/unpoison";
import SolveButton from "./components/SolveButton";
import SettingsButton from "./components/SettingsButton";
import SettingsModal from "./components/SettingsModal";

export default function App() {
  return (
    <>
      <Unpoison />
      <UiButtons />
    </>
  );
}

function UiButtons() {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <>
      <div class={"flex h-full gap-1"}>
        <SolveButton />
        <SettingsButton onClick={() => setSettingsOpen(true)} />
      </div>
      <SettingsModal open={settingsOpen()} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
