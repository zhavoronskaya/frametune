"use client";

import SwitchCheckBox from "@/lib/ui/components/SwitchCheckBox";

type Props = {
  checked: boolean;
  onChange: () => void;
};
const MuteSoundSwitch = ({ checked, onChange }: Props) => {
  return (
    <label className="flex items-center justify-between gap-2 px-4 py-6 border-[var(--border)] border-b">
      <span className="text-sm">Mute Sound</span>
      <SwitchCheckBox onChange={onChange} checked={checked} />
    </label>
  );
};

export default MuteSoundSwitch;
