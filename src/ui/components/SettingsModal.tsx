import { createSignal } from "solid-js";
import { createGmStorage } from "src/hooks/createGmStorage";

const models = {
  "⭐🐇 Gemini 3.1 Flash Lite": "gemini-3.1-flash-lite-preview",
  "⭐🐇 Gemini 2.5 Flash": "gemini-2.5-flash",
  "⭐🐢 Gemini 3 Flash": "gemini-3-flash-preview",
  "Gemini 3.1 Pro": "gemini-3.1-pro-preview",
  "Gemini 2.5 Flash Lite": "gemini-2.5-flash-lite",
  "Gemini 2.5 Pro": "gemini-2.5-pro",
  "Gemini 2.0 Flash": "gemini-2.0-flash",
  "Gemini 2.0 Flash Lite": "gemini-2.0-flash-lite",
  "Gemma 3 27B": "gemma-3-27b-it",
};

export default function SettingsModal(props: { open: boolean; onClose: () => void }) {
  const [geminiApiKey, setGeminiApiKey] = createGmStorage<string>("geminiApiKey", "", false);
  const [selectedModel, setSelectedModel] = createGmStorage<string>(
    "selectedModel",
    "gemini-3.1-flash-lite-preview",
    false,
  );
  const [tempGeminiApiKey, setTempGeminiApiKey] = createSignal<string>(geminiApiKey());
  const [tempSelectedModel, setTempSelectedModel] = createSignal<string>(selectedModel());

  const onCancel = () => {
    props.onClose();
    setTempGeminiApiKey(geminiApiKey());
    setTempSelectedModel(selectedModel());
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

          <p class={"mb-0 mt-2"}>Model</p>
          <select
            class={"inp-text"}
            value={tempSelectedModel()}
            on:input={(e) => setTempSelectedModel(e.currentTarget.value)}
          >
            {Object.entries(models).map(([name, value]) => (
              <option value={value}>{name}</option>
            ))}
          </select>

          <p class={"mb-0 mt-2"}>
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
                setSelectedModel(tempSelectedModel());
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
