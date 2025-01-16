import Button from "@/lib/ui/components/Button";
import TagsInput from "@/lib/ui/components/TagsInput";
import { useAppStore } from "@/state";
import { Entity } from "@/types";

type Props = {
  entity: Entity;
};

const AddTagsInput = ({ entity }: Props) => {
  const addEntityTag = useAppStore((s) => s.addEntityTag);
  const deleteEntityTag = useAppStore((s) => s.deleteEntityTag);
  const tags = useAppStore((s) => s.tags);
  if (!entity) return null;

  return (
    <div className="px-4 py-6 border-[var(--border)] border-b w-full">
      <label className="block text-sm pb-4 font-semibold">Tags</label>
      <TagsInput
        tags={entity.tags}
        taglist={tags}
        addTag={(tagName) => {
          addEntityTag(entity, tagName);
        }}
        deleteTag={(tagName) => {
          deleteEntityTag(entity, tagName);
        }}
      />
      <div className="pt-4 text-xs">
        <span>Suggested:</span>
        <span> vocal, bass, drums, etc. </span>
      </div>
    </div>
  );
};

export default AddTagsInput;
