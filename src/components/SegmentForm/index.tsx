"use client";

import {
  Music4Icon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Select from "@/lib/ui/components/Select";
import { useAppStore, useSoundsStore } from "@/state";
import { Id, Segment, Sound } from "@/types";
import useAppSounds from "@/hooks/useAppSounds";
import Button from "@/lib/ui/components/Button";
import SoundSettings from "../MuteSoundSwitch";
import AddTagsInput from "../AddTagsInput";

const SegmentForm = ({ segmentId }: { segmentId: Id }) => {
  const segments = useAppStore((state) => state.segments);
  const sounds = useSoundsStore((state) => state.segmentsSounds);
  const segment = segments[segmentId];

  if (!segment) return null;

  return (
    <div className="w-full">
      <SegmentSounds segment={segment} />
      <div className="py-2">
        <button onClick={() => console.log("Sounds", sounds[segment.id])}>
          Log Sounds
        </button>
      </div>
    </div>
  );
};

const SegmentSounds = ({ segment }: { segment: Segment }) => {
  const addSegmentSound = useAppStore((state) => state.addSegmentSound);
  const deleteSegmentSound = useAppStore((state) => state.deleteSegmentSound);
  const updateSegmentSound = useAppStore((state) => state.updateSegmentSound);
  const toggleMuteSegment = useAppStore((state) => state.toggleMuteSegment);

  const appSounds = useAppSounds();
  const handlePlus = () => {
    addSegmentSound(segment.id);
  };

  return (
    <div>
      <SoundSettings
        entity={segment}
        onMuteChange={() => toggleMuteSegment(segment.id)}
      />

      <div className="px-4 py-6 border-[var(--border)] border-b w-full">
        <label className="block text-sm pb-4 font-semibold">Sounds</label>

        {segment.sounds.map((src, idx) => {
          return (
            <div className="flex justify-between gap-2" key={idx}>
              <div className="w-full min-w-0">
                <Select
                  placeholder="Select sound..."
                  isSearchable
                  options={appSounds.sounds
                    .filter((src) => !segment.sounds.includes(src))
                    .map((src) => ({
                      title: <SoundOption src={src} />,
                      value: src,
                    }))}
                  value={src.replace("/sounds", "")}
                  onChange={(src) => updateSegmentSound(segment.id, idx, src)}
                  emptyStateIcon={
                    <Music4Icon size={18} color="#fff" strokeWidth={1} />
                  }
                  emptyStateTitle="No Sounds Available"
                  emptyStateDescription="You have used all of the preloaded sounds"
                />
              </div>

              <button
                onClick={() => {
                  deleteSegmentSound(segment.id, idx);
                }}
              >
                <Trash2Icon
                  color="#fff"
                  strokeWidth={1}
                  size={18}
                  className="opacity-60 hover:opacity-100"
                />
              </button>
            </div>
          );
        })}

        <Button
          onClick={handlePlus}
          className="text-xs flex items-center justify-center gap-2 w-[calc(100%-18px-0.5rem)] opacity-60 hover:opacity-100 mt-4"
        >
          Create Sound
          <PlusIcon
            color="#fff"
            strokeWidth={1}
            size={18}
            className=" inline"
          />
        </Button>
      </div>
      <AddTagsInput entity={segment} />
    </div>
  );
};

const SoundOption = ({ src }: { src: Sound["src"] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = useRef(new Audio(src));

  useEffect(() => {
    const onEnded = () => {
      setIsPlaying(false);
    };
    audio.current.addEventListener("ended", onEnded);
    return () => {
      audio.current.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) audio.current.play();
    else audio.current.pause();
  }, [isPlaying]);

  return (
    <div className="flex overflow-hidden justify-between items-center">
      {/* <span>{src.split("/").at(-1)}</span> */}
      <span
        className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-start "
        title={src}
      >
        {src.replace("/sounds", "")}
      </span>

      {isPlaying ? (
        <PauseIcon
          size={16}
          strokeWidth={1}
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(false);
          }}
        />
      ) : (
        <PlayIcon
          size={16}
          strokeWidth={1}
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(true);
          }}
        />
      )}
    </div>
  );
};

export default SegmentForm;
