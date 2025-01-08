import { MutableRefObject, useEffect } from "react";

function useClickOutside(
  ref: MutableRefObject<HTMLDivElement | null>,
  cb: () => void
) {
  useEffect(() => {
    if (!ref.current) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        cb();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
}

export default useClickOutside;
