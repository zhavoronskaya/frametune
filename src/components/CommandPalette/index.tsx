"use client";
import Select, { Option } from "@/lib/ui/components/Select";
import CommandsService from "@/services/Commands";
import { useAppStore } from "@/state";

type Props = {};

const CommandPalette = ({}: Props) => {
  const state = useAppStore();

  // const options = CommandsService.commands
  //   .filter((c) => c.precondition(state))
  //   .map((c) => ({ title: c.name, value: c.id }));

  return (
    <div className="">
      <Select
        placeholder="Select command..."
        isSearchable
        emptyStateTitle="No command available"
        emptyStateDescription="Please check your input or try again."
        options={[]}
        value={""}
        onChange={(v) => {
          switch (v) {
            case "entities.muteSound":
          }
        }}
        className="top-0 translate-y-[-150%]"
      />
    </div>
  );
};

export default CommandPalette;
