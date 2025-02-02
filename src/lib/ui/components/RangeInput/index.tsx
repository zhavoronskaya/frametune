"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "../../utils/classname";

interface RangeInputProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  onDraggingChange?: (isDragging: boolean) => void;
  className?: string;
  name?: string;
  isVertical?: boolean;
  isDisabled?: boolean;
}

export default function RangeInput({
  min,
  max,
  step = 1,
  value,
  onChange,
  onDraggingChange,
  name = "",
  isVertical = false,
  isDisabled = false,
  className = "",
}: RangeInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  useEffect(() => {
    onDraggingChange?.(isDragging);
  }, [isDragging]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDisabled) return;
      if (!isDragging) return;
      if (!rangeRef.current) return;

      const rect = rangeRef.current.getBoundingClientRect();
      const pos = isVertical ? e.clientY - rect.top : e.clientX - rect.left;
      const side = isVertical ? rect.height : rect.width;

      let percentage = Math.max(0, Math.min(100, (pos / side) * 100));
      if (isVertical) percentage = 100 - percentage;

      const newValue = Number(
        ((percentage / 100) * (max - min) + min).toFixed(
          getNumberDecimals(step)
        )
      );
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDisabled, isVertical, step, isDragging, min, max, onChange]);

  const rangeClassName = cn(
    "relative select-none w-full",
    isVertical && "-rotate-90",
    className
  );

  return (
    <div className={rangeClassName} ref={rangeRef}>
      <div className="h-2 bg-[--border] rounded-full overflow-hidden">
        {/* <div
          className="h-full bg-[--active-node] transition-all duration-200"
          style={{ width: `${percentage}%` }}
        /> */}

        <div
          className="h-full bg-[--active-node] transition-transform duration-200"
          style={{
            transform: `scaleX(${percentage / 100})`,
            transformOrigin: "left",
          }}
        />
      </div>

      <div
        className="absolute z-10 top-1/2 w-5 h-5 bg-[--foreground] border-2 border-[--active-node] rounded-full shadow transform -translate-y-1/2 -translate-x-1/2 transition-left duration-200 cursor-pointer"
        style={{ left: `${percentage}%` }}
        onMouseDown={() => setIsDragging(true)}
      >
        {isDragging && (
          <div
            className={cn(
              "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[--btn-bg-secondary] text-xs rounded-md pointer-events-none opacity-60",
              isVertical && "rotate-90"
            )}
          >
            {value.toFixed(getNumberDecimals(step))}
          </div>
        )}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        name={name}
        id={name}
        disabled={isDisabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

function getNumberDecimals(val: number) {
  const valString = val + "";
  const decimalsStartIdx = valString.indexOf(".") + 1;
  return !decimalsStartIdx ? 0 : valString.length - decimalsStartIdx;
}
