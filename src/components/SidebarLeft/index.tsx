"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, PlusIcon, Trash2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAppStore } from "@/state";
import { Cylinder, Cylinders, Line, Segment, Segments } from "@/types";
import { cn } from "@/lib/ui/utils/classname";
import { isInViewport } from "@/lib/ui/utils/viewport";

const SidebarLeft = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeEntity = useAppStore((state) => state.activeEntity);
  const lines = useAppStore((state) => state.lines);
  const cylinders = useAppStore((state) => state.cylinders);
  const segments = useAppStore((state) => state.segments);

  useEffect(() => {
    if (!sidebarRef.current) return;
    if (!activeEntity) return;

    const elSelector = `.entity-tree__node[data-${activeEntity.type}-id='${activeEntity.id}']`;
    const el = document.querySelector(elSelector);
    if (!el) return;

    const cylinderId = (() => {
      if (activeEntity.type === "cylinder") return activeEntity.id;
      if (activeEntity.type === "segment") return activeEntity.cylinderId;
      return -1;
    })();

    const lineId = (() => {
      if (activeEntity.type === "line") return activeEntity.id;
      if (activeEntity.type === "cylinder") return activeEntity.lineId;
      if (activeEntity.type === "segment") return cylinders[cylinderId].lineId;
      return -1;
    })();

    const lineSelector = `.entity-tree__node[data-line-id='${lineId}']`;
    const lineEl = document.querySelector(lineSelector);
    if (lineEl) (lineEl as HTMLDetailsElement).open = true;

    const cylinderSelector = `.entity-tree__node[data-cylinder-id='${cylinderId}']`;
    const cylinderEl = document.querySelector(cylinderSelector);
    if (cylinderEl) (cylinderEl as HTMLDetailsElement).open = true;

    if (!isInViewport(el as HTMLElement)) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeEntity]);

  const linesList = Object.values(lines);

  return (
    <div ref={sidebarRef} className="entity-tree h-full overflow-auto">
      <div className="py-6 px-4 text-sm">
        {linesList.map((line) => {
          return (
            <LineNode
              key={line.id}
              line={line}
              cylinders={cylinders}
              segments={segments}
            />
          );
        })}
      </div>
    </div>
  );
};

const LineNode = ({
  line,
  cylinders,
  segments,
}: {
  line: Line;
  cylinders: Cylinders;
  segments: Segments;
}) => {
  const changeLineName = useAppStore((s) => s.changeLineName);
  const deleteLine = useAppStore((s) => s.deleteLine);
  const activeEntity = useAppStore((state) => state.activeEntity);
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveEntity(line);
  };

  const handleNameChange = (name: string) => {
    changeLineName(line.id, name);
  };
  const isActive = activeEntity?.type === "line" && activeEntity.id === line.id;
  const isMuted = line.isMuted;
  const summaryClassName = twMerge(
    cn(
      "flex gap-2 my-0.5 pr-1 cursor-pointer items-center rounded-md hover:bg-[--sidebar-active] border border-transparent",
      isActive &&
        "border border-[--border] bg-[--active-node] hover:bg-[--active-node]",
      isMuted && "line-through"
    )
  );

  const deleteItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteLine(line.id);
  };

  return (
    <details className="entity-tree__node" data-line-id={line.id}>
      <summary className={summaryClassName}>
        <ChevronDown color="#fff" strokeWidth={1} />

        <NodeName
          onNameChange={handleNameChange}
          onClick={handleClick}
          onTrashClick={deleteItem}
        >
          {line.name}
        </NodeName>
      </summary>

      <div className="pl-4">
        {line.cylinders.map((cylinderId) => {
          const cylinder = cylinders[cylinderId];
          if (!cylinder) return null;

          return (
            <CylinderNode
              key={cylinder.id}
              cylinder={cylinder}
              segments={segments}
            />
          );
        })}
      </div>
    </details>
  );
};

const CylinderNode = ({
  cylinder,
  segments,
}: {
  cylinder: Cylinder;
  segments: Segments;
}) => {
  const activeEntity = useAppStore((state) => state.activeEntity);
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);
  const changeCylinderName = useAppStore((state) => state.changeCylinderName);
  const deleteCylinder = useAppStore((state) => state.deleteCylinder);
  const addSegment = useAppStore((state) => state.addSegment);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveEntity(cylinder);
  };

  const handleNameChange = (name: string) => {
    changeCylinderName(cylinder.id, name);
  };

  const isActive =
    activeEntity?.type === "cylinder" && activeEntity.id === cylinder.id;
  const isMuted = cylinder.isMuted;
  const summaryClassName = twMerge(
    cn(
      "cursor-pointer flex gap-2 rounded-md items-center my-0.5 pr-1 border border-transparent hover:bg-[--sidebar-active]",
      isActive &&
        "border border-[--border] bg-[--active-node] hover:bg-[--active-node]",
      isMuted && "line-through"
    )
  );

  const deleteItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteCylinder(cylinder.id);
  };

  const addItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addSegment(cylinder.id);
  };

  return (
    <details className="entity-tree__node" data-cylinder-id={cylinder.id}>
      <summary className={summaryClassName}>
        <ChevronDown color="#fff" strokeWidth={1} />
        <NodeName
          onClick={handleClick}
          onNameChange={handleNameChange}
          onTrashClick={deleteItem}
          onPlusClick={addItem}
        >
          {cylinder.name}
        </NodeName>

        {isActive && <></>}
      </summary>

      <div className="pl-4">
        {cylinder.segments.map((segmentId) => {
          const segment = segments[segmentId];
          if (!segment) return null;

          return <SegmentNode key={segment.id} segment={segment} />;
        })}
      </div>
    </details>
  );
};

const SegmentNode = ({ segment }: { segment: Segment }) => {
  const setActiveEntity = useAppStore((state) => state.setActiveEntity);
  const activeEntity = useAppStore((state) => state.activeEntity);
  const changeSegmentName = useAppStore((state) => state.changeSegmentName);
  const deleteSegment = useAppStore((state) => state.deleteSegment);

  const handleClick = () => {
    setActiveEntity(segment);
  };

  const handleNameChange = (name: string) => {
    changeSegmentName(segment.id, name);
  };

  const isActive =
    activeEntity?.type === "segment" && activeEntity.id === segment.id;

  const hasSound = segment.sounds.find((s) => s.length > 0);
  const isMuted = segment.isMuted;

  const divClassName = twMerge(
    cn(
      "entity-tree__node my-0.5 pr-1 cursor-pointer flex gap-2 rounded-md items-center border border-transparent hover:bg-[--sidebar-active]",
      isActive &&
        "border border-[--border] bg-[--active-node] hover:bg-[--active-node]",
      !hasSound && "opacity-60",
      isMuted && "line-through"
    )
  );

  const deleteItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteSegment(segment.id);
  };

  return (
    <div className={divClassName}>
      <ChevronDown color="#fff" strokeWidth={1} className="opacity-0" />
      <NodeName
        onClick={handleClick}
        onNameChange={handleNameChange}
        onTrashClick={deleteItem}
      >
        {segment.name}
      </NodeName>
    </div>
  );
};

export const NodeName = ({
  onClick,
  onNameChange,
  onPlusClick,
  onTrashClick,
  children,
  inputClassName,
}: {
  onClick: (e: React.MouseEvent) => void;
  onPlusClick?: (e: React.MouseEvent) => void;
  onTrashClick?: (e: React.MouseEvent) => void;
  onNameChange: (name: string) => void;
  children: string;
  inputClassName?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inputResultClassName = cn(
    "flex-1 bg-[--sidebar] rounded-md px-0.5 w-full",
    inputClassName
  );

  if (isEditing) {
    return (
      <input
        type="text"
        autoFocus
        // className="bg-transparent rounded-md px-1"
        className={inputResultClassName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsEditing(false);
        }}
        onBlur={() => setIsEditing(false)}
        value={children}
      />
    );
  }

  return (
    <span
      className="flex flex-1 justify-between gap-2 h-[24px] items-center"
      onClick={onClick}
      onDoubleClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <div className="flex gap-1 items-center">
          {onPlusClick && (
            <PlusIcon
              color="#fff"
              strokeWidth={1}
              onClick={onPlusClick}
              size={18}
              className="opacity-60 hover:opacity-100"
            />
          )}

          {onTrashClick && (
            <Trash2Icon
              color="#fff"
              strokeWidth={1}
              onClick={onTrashClick}
              // onKeyDown={(e) => {
              //   if (e.key === "Backspace" || e.key === "Dackspace" ) onTrashClick(e);
              // }}
              size={18}
              className="opacity-60 hover:opacity-100"
            />
          )}
        </div>
      )}
    </span>
  );
};

export default SidebarLeft;
