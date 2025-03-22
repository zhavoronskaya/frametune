"use client";

import { useAppStore, useSoundsStore } from "@/state";
import { Id, Segment, Sound } from "@/types";

import useAppSounds from "@/hooks/useAppSounds";
import useSearchParam from "@/lib/ui/hooks/useSearchParam";

import SoundSettings from "../MuteSoundSwitch";
import AddTagsInput from "../AddTagsInput";
import { SoundsPickerV1, SoundsPickerV2 } from "../SoundsPicker";

const SegmentForm = ({ segmentId }: { segmentId: Id }) => {
  const segments = useAppStore((state) => state.segments);
  const sounds = useSoundsStore((state) => state.segmentsSounds);
  const segment = segments[segmentId];

  if (!segment) return null;

  return (
    <div className="w-full">
      <SegmentSounds segment={segment} />
      {/* <div className="py-2">
        <button onClick={() => console.log("Sounds", sounds[segment.id])}>
          Log Sounds
        </button>
      </div> */}
    </div>
  );
};

const SegmentSounds = ({ segment }: { segment: Segment }) => {
  const soundsPickerVersion = useSearchParam("sounds-picker-version") ?? "1";
  const appSounds = useAppSounds();
  const toggleMuteSegment = useAppStore((state) => state.toggleMuteSegment);

  return (
    <div>
      <SoundSettings
        entity={segment}
        onMuteChange={() => toggleMuteSegment(segment.id)}
      />

      {soundsPickerVersion === "1" && (
        <SoundsPickerV1 sounds={appSounds.sounds} segment={segment} />
      )}
      {soundsPickerVersion === "2" && (
        <SoundsPickerV2 sounds={appSounds.sounds} segment={segment} />
      )}

      <AddTagsInput entity={segment} />
    </div>
  );
};

export default SegmentForm;
