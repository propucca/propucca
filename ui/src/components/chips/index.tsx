import React, { FC } from "react";
import { Chip } from "@heroui/react";

interface IChip {
  value: string;
  color?:
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  allowRemove?: boolean;
}

const Chips: FC<IChip> = ({
  value,
  color = "secondary",
  allowRemove = false,
}) => {
  return (
    <Chip
      color={color}
      className="text-white font-bold flex flex-col gap-2"
      variant="solid"
    >
      {value}
      {allowRemove && <span className="ml-2">X</span>}
    </Chip>
  );
};

export default Chips;
