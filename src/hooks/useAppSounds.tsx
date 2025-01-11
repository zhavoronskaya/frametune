"use client";
import { useAppStore, useSoundsStore } from "@/state";
import { Segment } from "@/types";
import { createContext, useContext } from "react";

export const SoundsCtx = createContext([] as string[]);

export const SoundsProvider = ({
  sounds,
  children,
}: {
  sounds: string[];
  children: React.ReactNode;
}) => {
  return <SoundsCtx.Provider value={sounds}>{children}</SoundsCtx.Provider>;
};

const useAppSounds = () => {
  const sounds = useContext(SoundsCtx);
  const segmentsSounds = useSoundsStore((s) => s.segmentsSounds);
  const cylinders = useAppStore((s) => s.cylinders);
  const lines = useAppStore((s) => s.lines);
  const isMutedGlobally = useAppStore((s) => s.isMuted);

  const playSegmentSounds = (segment: Segment) => {
    const cylinder = cylinders[segment.cylinderId];
    const line = lines[cylinder.lineId];

    const sounds = segmentsSounds[segment.id];
    if (!sounds) return false;

    const isMuted =
      segment.isMuted || cylinder.isMuted || line.isMuted || isMutedGlobally;
    if (isMuted) return false;

    const nonEmptySound = sounds.find((s) => Boolean(s.src));
    if (!nonEmptySound) return false;

    sounds.forEach((sound) => sound.audio.play());

    return true;
  };

  // const muteSegmentSounds = (segment: Segment) => {
  //   segmentsSounds[segment.id]?.forEach((sound) => {
  //     sound.audio.src && (sound.audio.volume = 0);
  //   });
  // };

  return {
    sounds,
    playSegmentSounds,
  };
};

export default useAppSounds;
