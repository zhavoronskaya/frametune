import SoundOption from "../SoundOption";

export default function SoundsPickerOption({ name, clickHandler, filePath }) {
  const optionPicked = () => { clickHandler(name) };

  if (filePath) {
    return (
      <li onClick={optionPicked}>
	<SoundOption name={name} src={filePath}/>
      </li>
    )
  } else {
    return (<li onClick={optionPicked}>{name}</li>);
  }
};
