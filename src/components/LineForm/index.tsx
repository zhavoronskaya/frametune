import { useAppStore } from "@/state";
import { Cylinder, Id } from "@/types";
import MuteSoundSwitch from "../MuteSoundSwitch";

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
    </div>
  );
};

export default LineForm;
