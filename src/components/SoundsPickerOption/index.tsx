export default function SoundsPickerOption({ name, clickHandler }) {
  const optionPicked = () => { clickHandler(name) };
  
  return (<li onClick={optionPicked}>{name}</li>)
}
