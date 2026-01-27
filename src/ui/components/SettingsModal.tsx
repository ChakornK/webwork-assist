import { useState } from "preact/hooks";
import { useStorage } from "src/hooks/useStorage";

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [geminiApiKey, setGeminiApiKey] = useStorage("geminiApiKey", "", false);
  const [tempGeminiApiKey, setTempGeminiApiKey] = useState(geminiApiKey);

  const onCancel = () => {
    onClose();
    setTempGeminiApiKey(geminiApiKey);
  };

  return (
    <div class={"fixed inset-0"} style={{ display: open ? "block" : "none" }}>
      <div class={"absolute inset-0 bg-black/50"} onClick={onCancel}></div>
      <div class={"pointer-events-none absolute inset-0 flex items-center justify-center p-8"}>
        <div
          class={
            "pointer-events-auto flex w-full max-w-md flex-col items-stretch gap-2 rounded-md bg-white p-4 shadow-md"
          }
        >
          <h1 class={"text-2xl font-semibold"}>WebWork Assist Settings</h1>

          <a class={"mt-2"}>
            Gemini API key (
            <a class={"link cursor-help"} href={"https://aistudio.google.com/app/api-keys"} target={"_blank"}>
              ?
            </a>
            )
          </a>
          <input
            type="text"
            class={"inp-text"}
            placeholder={"AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
            value={tempGeminiApiKey}
            onInput={(e) => setTempGeminiApiKey(e.currentTarget.value)}
          />

          <div class={"mt-2 flex justify-end gap-1"}>
            <button class={"btn"} onClick={onCancel}>
              Cancel
            </button>
            <button
              class={"btn"}
              onClick={() => {
                onClose();
                setGeminiApiKey(tempGeminiApiKey);
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
