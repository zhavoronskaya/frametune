"use client";
import { useAppStore, useSoundsStore } from "@/state";
import { Segment } from "@/types";
import { createContext, useContext } from "react";

// const sounds = [
//   "/sounds/hit.mp3",
//   "/sounds/1.wav",
//   "/sounds/2.wav",
//   "/sounds/3.wav",
//   "/sounds/4.wav",
//   "/sounds/5.wav",
//   "/sounds/6.wav",
//   "/sounds/7.wav",
//   "/sounds/8.wav",
//   "/sounds/9.wav",
//   "/sounds/9.wav",
//   "/sounds/10.wav",
//   "/sounds/11.wav",
//   "/sounds/12.wav",
//   "/sounds/13.wav",
//   "/sounds/14.wav",
//   "/sounds/15.wav",
//   "/sounds/16.wav",
//   "/sounds/17.wav",
//   "/sounds/18.wav",
//   "/sounds/19.wav",
//   "/sounds/20.wav",
//   "/sounds/21.wav",
//   "/sounds/22.wav",
//   "/sounds/23.wav",
//   "/sounds/24.wav",
//   "/sounds/25.wav",
//   "/sounds/26.wav",
// ];

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

  const muteSegmentSounds = (segment: Segment) => {
    segmentsSounds[segment.id]?.forEach((sound) => {
      sound.audio.src && (sound.audio.volume = 0);
    });
  };

  return {
    sounds,
    playSegmentSounds,
  };
};

export default useAppSounds;
