type IconsProps = {
  className?: string;
  size?: number;
};

export const Logo = ({ className, size = 19 }: IconsProps) => {
  return (
    <svg
      width={size}
      className={className}
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.70457 0.999998L9.5002 14.9501L17.2958 1L1.70457 0.999998ZM8.62725 15.4379C9.00888 16.1208 9.99152 16.1208 10.3731 15.4379L18.1688 1.48782C18.5413 0.821253 18.0594 0 17.2958 0H1.70457C0.940985 0 0.459134 0.821251 0.831628 1.48782L8.62725 15.4379Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5002 5.89324L17.2169 0.587979L17.7835 1.41202L10.0002 6.76302V15H9.0002V6.76302L1.21693 1.41202L1.78346 0.587979L9.5002 5.89324Z"
        fill="white"
      />
    </svg>
  );
};
