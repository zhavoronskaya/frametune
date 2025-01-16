import { cn } from "../../utils/classname";

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

const EmptyState = ({ icon, title, description, className }: Props) => {
  return (
    <div className={cn("flex flex-col items-center gap-2 py-8", className)}>
      <div>{icon}</div>
      <h6 className="text-sm">{title}</h6>
      <p className="text-sm text-center font-normal opacity-40">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
