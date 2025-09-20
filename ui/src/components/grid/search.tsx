"use client";

import React, { FC } from "react";
import { Input } from "@heroui/react";
// @ts-ignore
import UilSearch from "@iconscout/react-unicons/icons/uil-search";
// @ts-ignore
import UilClear from "@iconscout/react-unicons/icons/uil-multiply";

export interface IGridSearch {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchEnter?: () => void;
  searchPlaceholder?: string;
}

const GridSearch: FC<IGridSearch> = ({
  searchValue,
  onSearchChange,
  onSearchEnter,
  searchPlaceholder = "Search...",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearchEnter) {
      onSearchEnter();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        startContent={<UilSearch color="black" size="24" />}
        size="md"
        variant="faded"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="max-w-xs"
        endContent={
          <div
            className="cursor-pointer"
            onClick={(): void => {
              onSearchChange && onSearchChange("");
              onSearchEnter && onSearchEnter();
            }}
          >
            <UilClear color="black" size="20" />
          </div>
        }
      />
    </div>
  );
};

export default GridSearch;
