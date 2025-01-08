"use client";

import { useAppStore } from "@/state";
import { Id } from "@/types";
import { NodeName } from "../SidebarLeft";
import CylinderForm from "../CylinderForm";
import SegmentForm from "../SegmentForm";
import LineForm from "../LineForm";

type Props = {
  lineId?: Id;
};

const SidebarRight = ({}: Props) => {
  const activeEntity = useAppStore((state) => state.activeEntity);
  if (!activeEntity) return null;

  return (
    <div className="relative">
      {activeEntity?.type === "line" && (
        <div className="w-full">
          <EntityTitle entitySrc="lines" entityId={activeEntity.id} />
          <LineForm lineId={activeEntity.id} />
        </div>
      )}

      {activeEntity?.type === "cylinder" && (
        <div className="w-full">
          <EntityTitle entitySrc="cylinders" entityId={activeEntity.id} />
          <CylinderForm cylinderId={activeEntity.id} />
        </div>
      )}

      {activeEntity?.type === "segment" && (
        <div className="w-full">
          <EntityTitle entitySrc="segments" entityId={activeEntity.id} />
          <SegmentForm segmentId={activeEntity.id} />
        </div>
      )}
    </div>
  );
};

const EntityTitle = ({
  entitySrc,
  entityId,
}: {
  entitySrc: "segments" | "cylinders" | "lines";
  entityId: Id;
}) => {
  const entity = useAppStore((s) => s[entitySrc][entityId] ?? null);
  const changeCylinderName = useAppStore((s) => s.changeCylinderName);
  const changeLineName = useAppStore((s) => s.changeLineName);
  const changeSegmentName = useAppStore((s) => s.changeSegmentName);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleNameChange = (name: string) => {
    if (entitySrc === "cylinders") changeCylinderName(entity.id, name);
    else if (entitySrc === "lines") changeLineName(entity.id, name);
    else changeSegmentName(entity.id, name);
  };

  if (!entity) return null;

  return (
    <div className="px-4 py-6 border-[var(--border)] border-b font-semibold text-xl ">
      {/* <div className="flex flex-row"> */}
      <NodeName
        onClick={handleClick}
        onNameChange={handleNameChange}
        // className="px-4"
      >
        {entity.name}
      </NodeName>
      {/* </div> */}
    </div>
  );
};

export default SidebarRight;
