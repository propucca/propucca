// @ts-nocheck
import React, { FC } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
} from "@heroui/react";

export interface IOption {
  label?: string;
  value?: string;
}

interface IDropdown {
  options: IOption[];
  buttonLabel: string;
  onSelect: (event: IOption) => void;
  buttonColor?: string;
  selected?: IOption;
}

const DropdownField: FC<IDropdown> = ({
  buttonLabel,
  options,
  onSelect,
  buttonColor = "white",
  selected,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className={`text-${buttonColor}`}>
          {selected && selected.label ? selected.label : buttonLabel}
        </Button>
      </DropdownTrigger>
      {options && options.length && (
        <DropdownMenu>
          {options.map((ele: IOption) => {
            return (
              <DropdownItem
                key={ele.value}
                onClick={(): void => {
                  onSelect(ele);
                }}
              >
                {ele.label}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      )}
    </Dropdown>
  );
};

// DropdownField.displayName = "Dropdown";

export default DropdownField;
