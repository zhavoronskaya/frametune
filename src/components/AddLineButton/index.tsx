"use client";
import Button from "@/lib/ui/components/Button";
import { useAppStore } from "@/state";
import { PlusIcon } from "lucide-react";

const AddLineButton = () => {
  const addLine = useAppStore((state) => state.addLine);

  const handleClick = () => {
    addLine();
  };

  return (
    <Button size="lg" rounded className="px-2 py-2" onClick={handleClick}>
      <PlusIcon color="#ffffff" strokeWidth={1} />
    </Button>
  );
};

export default AddLineButton;
