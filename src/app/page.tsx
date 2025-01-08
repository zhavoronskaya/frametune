import AddLineButton from "@/components/AddLineButton";
import SidebarRight from "@/components/SidebarRight";
import { Logo } from "@/components/Icons";
import MusicBoxCanvas from "@/components/MusicBoxScene";
import SidebarLeft from "@/components/SidebarLeft";
import SoundRepository from "@/services/SoundsRepository";
import { SoundsProvider } from "@/hooks/useAppSounds";
import MuteSoundButton from "@/components/MuteSoundButton";

export default async function Home() {
  const sounds = await SoundRepository.getAllSounds();

  console.log("SOIUNDS", sounds);

  return (
    <>
      <SoundsProvider sounds={sounds}>
        <header className="fixed w-full z-20">
          <div className="flex px-4 py-2 border-b border-[--border]">
            <div className="flex gap-2">
              <h1 className="text-md font-bold uppercase">FrameTune</h1>
              <Logo />
            </div>
          </div>
        </header>

        <main className="h-full w-full pt-[41px]">
          <div className="flex flex-row h-full w-full">
            <div className="w-[256px] h-full bg-[var(--sidebar)] border-r border-[var(--border)] relative">
              <SidebarLeft />
            </div>

            <div className="flex-1 bg-[var(--canvas)] p-2 overflow-hidden relative">
              <MusicBoxCanvas />
              <div className="absolute z-10 bottom-16 left-[50%] translate-x-[-50%] w-64 text-center animation-fade-in">
                <AddLineButton />
              </div>
              <div className="absolute right-2 bottom-16 translate-x-[-50%]  text-center animation-fade-in">
                <MuteSoundButton />
              </div>
            </div>

            <div className="w-[256px] h-full overflow-auto bg-[var(--sidebar)] border-l border-[var(--border)] relative ">
              <SidebarRight />
            </div>
          </div>
        </main>
      </SoundsProvider>
    </>
  );
}
