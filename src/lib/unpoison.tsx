export let fetch: typeof window.fetch;
export let console: typeof window.console;

export function Unpoison() {
  return (
    <iframe
      src=""
      class={"hidden"}
      ref={(el) => {
        fetch = el.contentWindow?.fetch;
        console = (el.contentWindow as (Window & typeof globalThis) | null)?.console;
      }}
    ></iframe>
  );
}
