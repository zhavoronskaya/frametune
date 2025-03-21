import RangeInput from "@/lib/ui/components/RangeInput";
import { useAppStore } from "@/state";
import { Entity } from "@/types";

type Props = {
  entity: Entity;
};

const VolumeRange = ({ entity }: Props) => {
  const setEntityVolume = useAppStore((s) => s.setEntityVolume);

  const handleChange = (v: number) => {
    // TODO: check if preventDefault is needed
    // e.preventDefault();
    setEntityVolume(entity, v);
  };

  return (
    <div className="px-4 py-6 border-[var(--border)] border-b w-full">
      <label className="flex items-baseline justify-between text-sm pb-8 font-semibold">
        <span>Volume</span>
        <span className="opacity-60">{entity.volume}</span>
      </label>
      <RangeInput
        min={0}
        max={1}
        step={0.1}
        name={"Volume"}
        className=""
        onChange={handleChange}
        value={entity.volume}
      />
      {/* <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        className="rounded-md px-2 py-1 w-full hover:bg-[--active-node]"
        onChange={handleChange}
        value={entity.volume}
      /> */}
    </div>
  );
};

export default VolumeRange;
