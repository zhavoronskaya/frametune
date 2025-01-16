import { useAppStore } from "@/state";
import { Id } from "@/types";
import MuteSoundSwitch from "../MuteSoundSwitch";
import AddTagsInput from "../AddTagsInput";

const LineForm = ({ lineId }: { lineId: Id }) => {
  const lines = useAppStore((state) => state.lines);
  const toggleMuteLine = useAppStore((state) => state.toggleMuteLine);
  const line = lines[lineId];

  if (!line) return null;

  return (
    <div className="w-full">
      <MuteSoundSwitch
        checked={line.isMuted}
        onChange={() => toggleMuteLine(line.id)}
      />
      <AddTagsInput entity={line} />
    </div>
  );
};

export default LineForm;
