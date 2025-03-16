import SoundOption from "../SoundOption";

export default function SoundsPickerOption({ name, clickHandler, filePath }) {
  const optionPicked = () => { clickHandler(name) };

  if (filePath) {
    return (
      <li>
	<button onClick={optionPicked}>
	  <SoundOption name={name} src={filePath} buttonPosition={'left'}/>
	</button>
      </li>
    )
  } else {
    return (<li><button onClick={optionPicked}>{name}</button></li>);
  }
};
