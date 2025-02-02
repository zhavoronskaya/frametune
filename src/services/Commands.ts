import { Command } from "@/types";

export type CommandId = keyof typeof commands;

const commands = {
  "entities.muteSound": {
    id: "entities.muteSound",
    name: "Mute entities sound",
    precondition: (state) => {
      return false;
    },
  },
  Poops: {
    id: "Poops",
    name: "Poop in pants",
    precondition: (state) => {
      return false;
    },
  },
} as const satisfies Record<Command["id"], Command>;

const CommandsService = {
  commands,
};

export default CommandsService;
