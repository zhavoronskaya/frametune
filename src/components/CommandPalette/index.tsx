"use client";
import Select from "@/lib/ui/components/Select";
import { useEffect, useState } from "react";

type Props = {};

const CommandPalette = ({}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const selection = window.getSelection();

      console.log("EVENT", selection);
      if (key === "Control") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className="absolute top-0 w-[50%] z-20 left-[50%] mt-[-5px] translate-x-[-50%]">
          <Select
            placeholder="Select command..."
            isSearchable
            options={[]}
            value={""}
            onChange={() => {}}
          />
        </div>
      )}
    </>
  );
};

export default CommandPalette;
