import { ChevronDown, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import EmptyState from "../EmptyState";
import { cn } from "../../utils/classname";

export type Option = {
  title: React.ReactNode;
  value: string;
};

type Props = {
  value?: string;
  placeholder: string;
  options: Option[];
  onChange: (value: string) => void;
  emptyStateIcon?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  isSearchable?: boolean;
  className?: string;
};

const Select = ({
  value,
  placeholder,
  options,
  onChange,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  isSearchable,
  className,
}: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const onClick = () => {
    setSearch("");
    setIsOpen((v) => !v);
  };

  useClickOutside(divRef, () => {
    setIsOpen(false);
  });

  const filteredOptions = !isSearchable
    ? options
    : options.filter((o) =>
        o.value.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div ref={divRef} className="relative w-full py-2 ">
      {(!isSearchable || !isOpen) && (
        <button
          type="button"
          onClick={onClick}
          className="flex w-full h-[40px] items-center justify-between border border-[--border] rounded-md px-2 py-2 bg-[--btn-bg-primary] text-xs"
        >
          <span className="overflow-hidden whitespace-nowrap text-ellipsis text-start flex-1">
            {value || placeholder}
          </span>

          <div className="flex gap-1 items-center">
            {value && (
              <>
                <XIcon
                  color="#fff"
                  strokeWidth={1}
                  size={14}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                />
                <div className="h-[18px] border-l border-[--border]"></div>
              </>
            )}

            <ChevronDown color="#fff" size={18} strokeWidth={1} />
          </div>
        </button>
      )}

      {isSearchable && isOpen && (
        <input
          className="h-[40px] flex w-full items-center justify-between border border-[--border] rounded-md px-2 py-2 bg-[--btn-bg-primary] text-xs"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={value}
          autoFocus
        />
      )}

      {isOpen && (
        <div
          className={cn(
            "overflow-auto p-1 max-h-44 w-full absolute z-10 left-0 top-[100%] bg-[--btn-bg-primary] rounded-md",
            className
          )}
        >
          {filteredOptions.length === 0 && (
            <EmptyState
              icon={emptyStateIcon}
              title={emptyStateTitle ?? "No options available"}
              description={emptyStateDescription}
            />
          )}

          {filteredOptions.map((o) => {
            return (
              <button
                key={o.value}
                type="button"
                className="block w-full select-none text-sm py-1 px-2 rounded-sm hover:bg-[--active-node]"
                onClick={() => {
                  setIsOpen(false);
                  onChange(o.value);
                }}
              >
                {o.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
