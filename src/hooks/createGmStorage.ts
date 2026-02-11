import "@violentmonkey/types";
import { type Accessor, createEffect, createSignal, onCleanup, type Setter } from "solid-js";

export const createGmStorage = <T>(
  key: string,
  defaultValue: T,
  isJson: boolean,
): [Accessor<T>, (value: T) => void] => {
  const stored = GM_getValue(key) as any;
  const [value, setValue] = createSignal<T>(
    stored !== undefined ? (isJson ? JSON.parse(stored) : stored) : defaultValue,
  );

  const listener = GM_addValueChangeListener(key, (name: string, oldVal: any, newVal: any, remote: boolean) => {
    setValue(isJson ? JSON.parse(newVal) : newVal);
  });
  onCleanup(() => GM_removeValueChangeListener(listener));

  return [
    value,
    (v) => {
      GM_setValue(key, isJson ? JSON.stringify(v) : v);
      setValue(v as any);
    },
  ];
};
