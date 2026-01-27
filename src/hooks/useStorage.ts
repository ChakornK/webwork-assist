import { useEffect, useState } from "preact/hooks";
import "@violentmonkey/types";

export const useStorage = (key: string, defaultValue: any, isJson: boolean) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = GM_getValue(key) as any;
      return stored !== undefined ? (isJson ? JSON.parse(stored) : stored) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    GM_setValue(key, isJson ? JSON.stringify(value) : value);
  }, [key, value]);

  useEffect(() => {
    const listener = GM_addValueChangeListener(key, (name: string, oldVal: any, newVal: any, remote: boolean) => {
      setValue(isJson ? JSON.parse(newVal) : newVal);
    });
    return () => GM_removeValueChangeListener(listener);
  }, [key]);

  return [value, setValue];
};
