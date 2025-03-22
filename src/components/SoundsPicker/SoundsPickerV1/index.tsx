import { useEffect, useRef, useState } from "react";
import {
  Music4Icon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { useAppStore } from "@/state";
import { Segment, Sound } from "@/types";
import Button from "@/lib/ui/components/Button";
import Select from "@/lib/ui/components/Select";

type Props = {
  sounds: string[];
  segment: Segment;
};

const SoundsPicker = ({ sounds, segment }: Props) => {
  const addSound = useAppStore((state) => state.addSegmentSound);
  const deleteSound = useAppStore((state) => state.deleteSegmentSound);
  const updateSound = useAppStore((state) => state.updateSegmentSound);
  const handlePlus = () => addSound(segment.id);

  return (
    <div className="px-4 py-6 border-[var(--border)] border-b w-full">
      <label className="block text-sm pb-4 font-semibold">Sounds</label>

      {segment.sounds.map((src, idx) => {
        return (
          <div className="flex justify-between gap-2" key={idx}>
            <div className="w-full min-w-0">
              <Select
                placeholder="Select sound..."
                isSearchable
                options={sounds
                  .filter((src) => !segment.sounds.includes(src))
                  .map((src) => ({
                    title: <SoundOption src={src} />,
                    value: src,
                  }))}
                value={src.replace("/sounds", "")}
                onChange={(src) => updateSound(segment.id, idx, src)}
                emptyStateIcon={
                  <Music4Icon size={18} color="#fff" strokeWidth={1} />
                }
                emptyStateTitle="No Sounds Available"
                emptyStateDescription="You have used all of the preloaded sounds"
              />
            </div>

            <button
              onClick={() => {
                deleteSound(segment.id, idx);
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
        <PlusIcon color="#fff" strokeWidth={1} size={18} className=" inline" />
      </Button>
    </div>
  );
};

const SoundOption = ({ src }: { src: Sound["src"] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(src));

  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) audioRef.current.play();
    else audioRef.current.pause();
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

export default SoundsPicker;
