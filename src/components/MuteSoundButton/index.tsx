"use client";
import Button from "@/lib/ui/components/Button";
import { useAppStore } from "@/state";
import { Volume2Icon, VolumeIcon, VolumeXIcon } from "lucide-react";
import { useState } from "react";

const MuteSoundButton = () => {
  const isMuted = useAppStore((s) => s.isMuted);
  const toggleMute = useAppStore((s) => s.toggleMute);

  const handleClick = () => {
    toggleMute();
  };

  return (
    <Button size="lg" rounded className="px-2 py-2" onClick={handleClick}>
      {isMuted ? (
        <VolumeXIcon color="#ffffff" strokeWidth={1} />
      ) : (
        <Volume2Icon color="#ffffff" strokeWidth={1} />
      )}
    </Button>
  );
};

export default MuteSoundButton;
