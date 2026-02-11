import { onMount } from "solid-js";

export let fetch: typeof window.fetch;
export let console: typeof window.console;

export function Unpoison() {
  let iframeRef: HTMLIFrameElement | null = null;

  onMount(() => {
    fetch = iframeRef.contentWindow?.fetch;
    console = (iframeRef.contentWindow as (Window & typeof globalThis) | null)?.console;
  });

  return <iframe src="" class={"hidden"} ref={iframeRef}></iframe>;
}
