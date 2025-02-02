import { useAppStore } from "@/state";
import { Cylinder, Id } from "@/types";
import SoundSettings from "../MuteSoundSwitch";
import AddTagsInput from "../AddTagsInput";
import RangeInput from "@/lib/ui/components/RangeInput";

const CylinderForm = ({ cylinderId }: { cylinderId: Id }) => {
  const cylinders = useAppStore((state) => state.cylinders);
  const toggleMuteCylinder = useAppStore((state) => state.toggleMuteCylinder);
  const cylinder = cylinders[cylinderId];

  if (!cylinder) return null;

  return (
    <div className="w-full">
      <SoundSettings
        entity={cylinder}
        onMuteChange={() => toggleMuteCylinder(cylinder.id)}
      />

      <CylinderRange
        label="Position"
        name="positionX"
        cylinder={cylinder}
        value={cylinder.positionX}
        min={-1}
        max={1}
      />
      <CylinderRange
        label="Radius"
        name="radius"
        cylinder={cylinder}
        value={cylinder.radius}
        min={1}
        max={5}
      />
      <CylinderRange
        label="Speed"
        name="speed"
        cylinder={cylinder}
        value={cylinder.speed}
        min={0}
        max={10}
      />
      <AddTagsInput entity={cylinder} />
    </div>
  );
};

type CylinderInputType = {
  label: string;
  name: string;
  value: number;
  cylinder: Cylinder;
};

const CylinderRange = ({
  cylinder,
  label,
  name,
  value,
  min,
  max,
}: CylinderInputType & { min: number; max: number }) => {
  const updateCylinder = useAppStore((state) => state.updateCylinder);

  const handleChange = (v: number) => {
    // e.preventDefault(); // prevent the default action

    updateCylinder({ ...cylinder, [name]: v });
  };

  return (
    <div className="px-4 py-6 border-[var(--border)] border-b w-full">
      <label className="flex items-baseline justify-between text-sm pb-8 font-semibold ">
        <span>{label}</span>
        <span className="opacity-60">{value}</span>
      </label>
      <RangeInput
        min={min}
        max={max}
        step={0.1}
        value={Number(value)}
        className=""
        onChange={handleChange}
        name={name}
      />
      {/* <input
        type="range"
        min={min}
        max={max}
        step={0.1}
        id={name}
        name={name}
        className="rounded-md px-2 py-1 w-full hover:bg-[--active-node]"
        onChange={handleChange}
        value={value}
      /> */}
    </div>
  );
};

export default CylinderForm;
