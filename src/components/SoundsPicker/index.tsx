import { useState } from "react";
import { useAppStore } from "@/state";

import {
  Trash2Icon,
} from "lucide-react";

import Button from "@/lib/ui/components/Button";
import SoundsPickerOptions from "../SoundsPickerOptions";
import SoundsPickerOption from "../SoundsPickerOption";

import FilesExplorer from "@/services/FilesExplorer";

const PickedSoundsList = (sounds) => {
  const list = sounds.map(sound => <div>{sound}</div>);

  return (list);
};

export default function SoundsPicker(
  { sounds, addSound, updateSound, deleteSound, segment }
) {
  const wrapperClasses = "px-4 py-6 border-[var(--border)] border-b "
    + "w-full";
  const buttonClasses = "text-xs flex items-center justify-center " +
    "gap-2 w-[calc(100%-18px-0.5rem)] opacity-60 hover:opacity-100 " +
    "mt-4";

  // File explorer
  const [workingDir, setWorkingDir] = useState([]);
  
  const initiateExplorer = () => {
    const explorer =  new FilesExplorer(
      FilesExplorer.buildStructureFromFiles(sounds)
    );

    workingDir.forEach((dir) => { explorer.changeDir(dir); });

    return explorer;
  };
  
  // Options
  const [options, setOptions] = useState([]);

  // Component state
  const [state, setState] = useState('picked');
  
  const armExplorer = () => {
    const explorer = initiateExplorer();

    setOptions(explorer.list());
    setWorkingDir(explorer.workingDir);
    
    setState('armed');
  };  
  const disarmExplorer = () => {
    setState('picked');

    setOptions([]);
    setWorkingDir([]);
  };
  const pickSound = (name) => {
    const explorer = initiateExplorer();
    addSound(segment.id);
    updateSound(segment.id, segment.sounds.length, explorer.absolutePath(name));
    setState('picked');
  };
  
  const inArmedState = state === 'armed';
  const inPickedState = state === 'picked';

  const handleDirClick = (dirName) => {
    let explorer = initiateExplorer();

    explorer.changeDir(dirName);
    
    setOptions(explorer.list());
    setWorkingDir(explorer.workingDir);
  };

  const buildOptions = () => {
    const explorer = initiateExplorer();
    
    return explorer.list().map((name) => {
      if (explorer.aFile(name)) {
	return { name, onClick: pickSound, filePath: explorer.absolutePath(name) };
      } else if (explorer.aDir(name)) {
	return { name, onClick: handleDirClick };
      }
    });
  };

  const handleSoundDelete = (segmentId, idx) => {
    deleteSound(segmentId, idx);
    initiateExplorer();
  };

  const pickedSoundsList = segment.sounds.map((sound) => {
    return sound.split('/').at(-1);
  }).map((sound, idx) => {
    return <div className='flex'><button onClick={() => { handleSoundDelete(segment.id, idx)}}><Trash2Icon color="#fff" strokeWidth={1} size={18} className="opacity-60 hover:opacity-100" /></button><div>{sound}</div></div>;
  });

  if (inInitialState) {
    return (
      <div className={wrapperClasses}>
	<Button onClick={armExplorer} className={buttonClasses}>
	  Add Sound
        </Button>
      </div>
    );
  } else if (inArmedState) {
    return (
      <div className={wrapperClasses}>
	<Button onClick={disarmExplorer} className={buttonClasses}>
	  Cancel
        </Button>
	
        <ul>
          {buildOptions().map((option) => {
	    return <SoundsPickerOption clickHandler={option.onClick} name={option.name} filePath={option.filePath} />
	  })}
        </ul>
      </div>
    );
  } else if (inPickedState) {
    return (
      <div className={wrapperClasses}>
	<div>
          Picked Sounds
        </div>
	
	{pickedSoundsList}
      
	<div>
	  <Button onClick={armExplorer} className={buttonClasses}>
	    Add Sound
          </Button>
	</div>
      </div>
    );
  }
};
