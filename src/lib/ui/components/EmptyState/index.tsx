type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
};

const EmptyState = ({ icon, title, description }: Props) => {
  return (
    <div className="flex flex-col items-center gap-2 py-8">
      <div>{icon}</div>
      <h6 className="text-sm">{title}</h6>
      <p className="text-sm text-center font-normal opacity-40">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
