import { getFilepaths } from "@/lib/fs";

const SoundRepository = {
  getAllSounds: async () => {
    const sounds = await getFilepaths("./public/sounds");
    return sounds
      .filter((s) => !s.endsWith(".DS_Store"))
      .map((s) => "/sounds/" + s);
  },
};

export default SoundRepository;
