import clsx from "clsx";
import styles from "./InputCheckbox.module.css";

type Props = Omit<JSX.IntrinsicElements["input"], "type"> & {
  color?: string;
};
const SwitchCheckBox = ({
  className,
  color = "var(--active-node)",
  ...props
}: Props) => {
  const resultClassName = clsx(
    "relative h-6 w-12 inline-block rounded-full border-1 cursor-pointer relative",
    className
  );
  return (
    <div className={resultClassName} style={{ border: `1px solid ${color}` }}>
      <input {...props} className="hidden" type="checkbox" />
      <span
        className={`${styles.inner} absolute left-1 top-0 bottom-0 m-auto rounded-full bg-[--active-node] w-4 h-4`}
        style={{ background: color }}
      />
    </div>
  );
};

export default SwitchCheckBox;
