"use client";

import SwitchCheckBox from "@/lib/ui/components/SwitchCheckBox";
import VolumeRange from "../VolumeRange";
import { Entity } from "@/types";

type Props = {
  entity: Entity;
  onMuteChange: () => void;
};
const SoundSettings = ({ entity, onMuteChange }: Props) => {
  return (
    <div className="border-[var(--border)] border-b">
      <label className="flex items-center justify-between gap-2 px-4 py-6 ">
        <span className="text-sm">Mute</span>
        <SwitchCheckBox onChange={onMuteChange} checked={entity.isMuted} />
      </label>

      <VolumeRange entity={entity} />
    </div>
  );
};

export default SoundSettings;
