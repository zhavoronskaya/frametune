"use client";
import { Volume2Icon, VolumeXIcon } from "lucide-react";
import Button from "@/lib/ui/components/Button";
import { useAppStore } from "@/state";
import { useEffect, useState } from "react";
import RangeInput from "@/lib/ui/components/RangeInput";
import { div } from "three/tsl";

const MuteSoundButton = () => {
  const isMuted = useAppStore((s) => s.isMuted);
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingMasterVolume, setIsDraggingMasterVolume] = useState(false);
  const masterVolume = useAppStore((s) => s.masterVolume);
  const setMasterVolume = useAppStore((s) => s.setMasterVolume);
  const toggleMute = useAppStore((s) => s.toggleMute);

  const handleClick = () => {
    toggleMute();
  };

  const handleEnter = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    if (isDraggingMasterVolume) return;
    setIsHovered(false);
  };

  const handleChange = (v: number) => {
    setMasterVolume(v);
  };

  useEffect(() => {
    if (!isDraggingMasterVolume && !isHovered) {
    }
  }, [isHovered, isDraggingMasterVolume]);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Button
        size="lg"
        rounded
        className="px-2 py-2 z-20"
        onClick={handleClick}
      >
        {isMuted ? (
          <VolumeXIcon color="#ffffff" strokeWidth={1} />
        ) : (
          <Volume2Icon color="#ffffff" strokeWidth={1} />
        )}
      </Button>

      {!isMuted && isHovered && (
        <div className="w-full h-[60px] absolute right-0 bottom-full pt-[20px]">
          <RangeInput
            min={0}
            max={1}
            step={0.1}
            name={"Master volume"}
            isVertical={true}
            onDraggingChange={setIsDraggingMasterVolume}
            onChange={handleChange}
            value={masterVolume}
          />
        </div>
      )}
    </div>
  );
};

export default MuteSoundButton;
