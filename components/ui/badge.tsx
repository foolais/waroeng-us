interface BadgeProps {
  option: {
    value: string;
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
  };
}

const Badge = ({ option }: BadgeProps) => {
  return (
    <div
      className={`flex items-center rounded-md px-2 py-1 text-sm ${option.bgColor} ${option.textColor}`}
    >
      <span
        className="mr-2 size-2.5 rounded-md"
        style={{ backgroundColor: option.color }}
      />
      {option.label}
    </div>
  );
};

export default Badge;
