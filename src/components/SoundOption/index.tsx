import { useEffect, useRef, useState } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

const SoundOption = (
  { src, name }: { src: Sound["src"], name: string }
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = useRef(new Audio(src));
  const optionName = name || src.replace("/sounds", "");

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
        {optionName}
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

export default SoundOption;
