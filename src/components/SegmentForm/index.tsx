"use client";

import { Music4Icon, PlusIcon, Trash2Icon } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import Select from "@/lib/ui/components/Select";
import { useAppStore, useSoundsStore } from "@/state";
import { Id, Segment, Sound } from "@/types";
import useAppSounds from "@/hooks/useAppSounds";
import Button from "@/lib/ui/components/Button";
import SoundSettings from "../MuteSoundSwitch";
import AddTagsInput from "../AddTagsInput";
import SoundsPicker from "../SoundsPicker";

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
  const addSegmentSound = useAppStore((state) => state.addSegmentSound);
  const toggleMuteSegment = useAppStore((state) => state.toggleMuteSegment);
  const appSounds = useAppSounds();

  const handlePlus = () => {
    addSegmentSound(segment.id);
  };

  return (
    <div>
      <SoundSettings
        entity={segment}
        onMuteChange={() => toggleMuteSegment(segment.id)}
      />

      <SoundsPicker sounds={appSounds.sounds} segment={segment} />

      <AddTagsInput entity={segment} />
    </div>
  );
};

export default SegmentForm;
