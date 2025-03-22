import { useState } from "react";
import { Trash2Icon } from "lucide-react";

import { Segment, SegmentsSounds } from "@/types";
import { useAppStore } from "@/state";

import FilesExplorer from "@/services/FilesExplorer";
import Button from "@/lib/ui/components/Button";

import SoundsPickerOption from "./SoundsPickerOption";

// const PickedSoundsList = (sounds) => {
//   const list = sounds.map((sound, idx) => <div key={idx}>{sound}</div>);

//   return list;
// };

type Props = {
  sounds: string[];
  segment: Segment;
};

const UP_DIR_NAME = "..";

export default function SoundsPicker({ sounds, segment }: Props) {
  const addSound = useAppStore((state) => state.addSegmentSound);
  const deleteSound = useAppStore((state) => state.deleteSegmentSound);
  const updateSound = useAppStore((state) => state.updateSegmentSound);

  const wrapperClasses =
    "px-4 py-6 border-[var(--border)] border-b " + "w-full";
  const buttonClasses =
    "text-xs flex items-center justify-center " +
    "gap-2 w-[calc(100%-18px-0.5rem)] opacity-60 hover:opacity-100 " +
    "mt-4";

  // File explorer
  const [workingDir, setWorkingDir] = useState<string[]>([]);

  const initiateExplorer = () => {
    return FilesExplorer.buildFromFilesPathAndDepth({
      files: sounds,
      depth: workingDir,
    });
  };

  // Component state
  const [state, setState] = useState("list");

  const inSelectState = state === "select";
  const inListState = state === "list";

  const armExplorer = () => {
    const explorer = initiateExplorer();

    setWorkingDir(explorer.workingDir);

    setState("select");
  };

  const disarmExplorer = () => {
    setState("list");

    setWorkingDir([]);
  };

  const pickSound = (name: string) => {
    const explorer = initiateExplorer();

    addSound(segment.id);
    updateSound(segment.id, segment.sounds.length, explorer.absolutePath(name));

    setState("list");

    setWorkingDir([]);
  };

  const handleDirClick = (dirName: string) => {
    const explorer = initiateExplorer();

    if (dirName === UP_DIR_NAME) explorer.goUpDir();
    else explorer.changeDir(dirName);

    setWorkingDir(explorer.workingDir);
  };

  const buildOptions = () => {
    const explorer = initiateExplorer();

    let optionsList = explorer.list();

    if (workingDir.length > 0) {
      optionsList = [UP_DIR_NAME].concat(optionsList);
    }

    return optionsList.map((name) => {
      const isFile = explorer.aFile(name);
      return {
        name,
        onClick: isFile ? pickSound : handleDirClick,
        filePath: isFile ? explorer.absolutePath(name) : null,
      };
    });
  };

  const handleSoundDelete = (segmentId: number, idx: number) => {
    deleteSound(segmentId, idx);
    setWorkingDir([]);
  };

  const pickedSoundsList = segment.sounds
    .map((sound) => {
      return sound.split("/").at(-1);
    })
    .map((sound, idx) => {
      return (
        <div key={sound} className="flex">
          <button
            onClick={() => {
              handleSoundDelete(segment.id, idx);
            }}
          >
            <Trash2Icon
              color="#fff"
              strokeWidth={1}
              size={18}
              className="opacity-60 hover:opacity-100"
            />
          </button>
          <div>{sound}</div>
        </div>
      );
    });

  if (inSelectState) {
    return (
      <div className={wrapperClasses}>
        <Button onClick={disarmExplorer} className={buttonClasses}>
          Cancel
        </Button>

        <ul>
          {buildOptions().map((option) => {
            return (
              <SoundsPickerOption
                key={option.name}
                onClick={() => option.onClick(option.name)}
                name={option.name}
                filePath={option.filePath}
              />
            );
          })}
        </ul>
      </div>
    );
  } else if (inListState) {
    return (
      <div className={wrapperClasses}>
        <label className="block text-sm pb-4 font-semibold">Sounds</label>

        {pickedSoundsList}

        <div>
          <Button onClick={armExplorer} className={buttonClasses}>
            Add Sound
          </Button>
        </div>
      </div>
    );
  }
}
