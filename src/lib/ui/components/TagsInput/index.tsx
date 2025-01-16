import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { cn } from "../../utils/classname";
import { Tags } from "@/types";

type Props = {
  addTag: (tagName: string) => void;
  deleteTag: (tagName: string) => void;
  tags: string[];
  taglist: Tags;
};

const TagsInput = ({ addTag, deleteTag, tags = [], taglist = {} }: Props) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const editableRef = useRef<HTMLSpanElement | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [tmpTag, setTmpTag] = useState("");

  const allTags = Object.keys(taglist);
  const suggestedTags = allTags.filter((t) => {
    if (tags.includes(t)) return false;
    return t.toLowerCase().includes(tmpTag.toLowerCase());
  });

  const onClick = () => {
    setIsFocused(true);
    setIsOpened(true);
    editableRef.current?.focus();
  };

  useClickOutside(divRef, () => {
    setIsFocused(false);
    setIsOpened(false);
    editableRef.current?.blur();
  });

  const resultCl = cn(
    "relative flex flex-wrap items-baseline border border-[--border] rounded-md px-2 py-2 bg-[--btn-bg-primary] text-xs gap-2",
    isFocused && "border-white"
  );

  const selectTagFromEditable = () => {
    addTag(tmpTag);
    setTmpTag("");
    if (editableRef.current) {
      editableRef.current.innerText = "";
    }
  };

  return (
    <div ref={divRef} className="relative w-full">
      <div className={resultCl} onClick={onClick}>
        {tags.map((t) => (
          <div
            className="flex rounded-md bg-[--active-node] px-2 py-1 gap-1 items-baseline h-full"
            key={t}
          >
            <span className="">{t}</span>
            <span className="cursor-pointer" onClick={() => deleteTag(t)}>
              &times;
            </span>
            {/* <XIcon color="#fff" strokeWidth={2} size={12} /> */}
          </div>
        ))}

        <span
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          // placeholder="Type somthing..."
          className=" h-4 min-w-1 bg-transparent border-none outline-none focus:outline-none"
          onBlur={selectTagFromEditable}
          onInput={(e) => {
            e.preventDefault();
            const el = e.target as HTMLSpanElement;
            const value = el.innerText.trim();
            setTmpTag(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              selectTagFromEditable();
            }
          }}
        />
      </div>

      {isOpened && suggestedTags.length != 0 && (
        <div className="overflow-auto p-1 mt-2 max-h-44 w-full absolute z-10 left-0 top-[100%] bg-[--btn-bg-primary] rounded-md">
          {suggestedTags.map((t) => {
            return (
              <button
                key={t}
                type="button"
                className="block w-full select-none text-sm py-1 px-2 rounded-sm hover:bg-[--active-node] text-start "
                onClick={() => {
                  addTag(t);
                  editableRef.current?.focus();
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TagsInput;
