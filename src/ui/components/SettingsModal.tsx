export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div class={"fixed inset-0"} style={{ display: open ? "block" : "none" }}>
      <div class={"absolute inset-0 bg-black/50"} onClick={onClose}></div>
      <div class={"absolute inset-0 flex items-center justify-center p-8"}>
        <div class={"flex w-full max-w-md flex-col items-stretch gap-2 rounded-md bg-white p-4 shadow-md"}>
          <h1 class={"text-2xl font-semibold"}>WebWork Assist Settings</h1>

          <p class={"mt-2"}>Gemini API key</p>
          <input type="text" class={"inp-text"} placeholder={"AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"} />

          <div class={"mt-2 flex justify-end gap-1"}>
            <button class={"btn"} onClick={onClose}>
              Cancel
            </button>
            <button class={"btn"} onClick={onClose}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
