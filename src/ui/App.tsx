import { createSignal } from "solid-js";
import { Unpoison } from "@/lib/unpoison";
import SolveButton from "@/ui/components/SolveButton";
import SettingsButton from "@/ui/components/SettingsButton";
import SettingsModal from "@/ui/components/SettingsModal";

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
