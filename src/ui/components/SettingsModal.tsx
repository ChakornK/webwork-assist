import { createSignal } from "solid-js";
import { createGmStorage } from "src/hooks/createGmStorage";

export default function SettingsModal(props: { open: boolean; onClose: () => void }) {
  const [geminiApiKey, setGeminiApiKey] = createGmStorage<string>("geminiApiKey", "", false);
  const [tempGeminiApiKey, setTempGeminiApiKey] = createSignal<string>(geminiApiKey());

  const onCancel = () => {
    props.onClose();
    setTempGeminiApiKey(geminiApiKey());
  };

  return (
    <div class={"fixed inset-0"} style={{ display: props.open ? "block" : "none" }}>
      <div class={"absolute inset-0 bg-black/50"} on:click={onCancel}></div>
      <div class={"pointer-events-none absolute inset-0 flex items-center justify-center p-8"}>
        <div
          class={
            "pointer-events-auto flex w-full max-w-md flex-col items-stretch gap-2 rounded-md bg-white p-4 shadow-md"
          }
        >
          <h1 class={"text-2xl font-semibold"}>WebWork Assist Settings</h1>

          <p class={"mt-2"}>
            Gemini API keys (comma-separated) (
            <a class={"link cursor-help"} href={"https://aistudio.google.com/app/api-keys"} target={"_blank"}>
              ?
            </a>
            )
          </p>
          <input
            type="text"
            class={"inp-text"}
            placeholder={"AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
            value={tempGeminiApiKey()}
            on:input={(e) => setTempGeminiApiKey(e.currentTarget.value)}
          />

          <div class={"mt-2 flex justify-end gap-1"}>
            <button class={"btn"} on:click={onCancel}>
              Cancel
            </button>
            <button
              class={"btn"}
              on:click={() => {
                props.onClose();
                setGeminiApiKey(tempGeminiApiKey());
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
