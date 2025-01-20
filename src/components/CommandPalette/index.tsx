"use client";
import Select from "@/lib/ui/components/Select";
import { useEffect, useState } from "react";

type Props = {};

const CommandPalette = ({}: Props) => {
  return (
    <div className="">
      <Select
        placeholder="Select command..."
        isSearchable
        emptyStateTitle="No command available"
        emptyStateDescription="Please check your input or try again."
        options={[]}
        value={""}
        onChange={() => {}}
        className="top-0 translate-y-[-150%]"
      />
    </div>
  );
};

export default CommandPalette;
