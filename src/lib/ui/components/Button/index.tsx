import { JSX } from "react";
import { cn } from "@/lib/ui/utils/classname";
import { twMerge } from "tailwind-merge";

type Props = JSX.IntrinsicElements["button"] & {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  rounded?: boolean;
};

const Button = ({
  children,
  onClick,
  rounded = false,
  size = "md",
  variant = "primary",
  className,
  ...rest
}: Props) => {
  const resultClassName = twMerge(
    cn(
      // "border border-black",
      "",
      size === "xs" && "text-xs px-1 py-1 rounded-xs",
      size === "sm" && "text-sm px-2 py-1 rounded-sm",
      size === "md" && "text-md px-4 py-2 rounded-md",
      size === "lg" && "text-lg px-8 py-4 rounded-lg",

      variant === "primary" && "bg-[--btn-bg-primary]",
      variant === "secondary" && "bg-[--btn-bg-secondary]",
      variant === "secondary" && "bg-transparent hover:bg-grey-200",

      rounded && "rounded-full",
      className
    )
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={resultClassName}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
