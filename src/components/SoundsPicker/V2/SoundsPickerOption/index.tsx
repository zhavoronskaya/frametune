import SoundOption from "../SoundOption";

type Props = {
  name: string;
  onClick: () => void; // TODO check if name is already in
  filePath: string | null;
};

export default function SoundsPickerOption({ name, onClick, filePath }: Props) {
  // if (filePath) {
  //   return (
  //     <li>
  //       <button onClick={onClick}>
  //         <SoundOption name={name} src={filePath} buttonPosition={"left"} />
  //       </button>
  //     </li>
  //   );
  // } else {
  //   return (
  //     <li>
  //       <button onClick={onClick}>{name}</button>
  //     </li>
  //   );
  // }

  return (
    <li>
      <button onClick={onClick}>
        {filePath ? (
          <SoundOption name={name} src={filePath} buttonPosition={"left"} />
        ) : (
          name
        )}
      </button>
    </li>
  );
}
