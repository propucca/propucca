"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Button,
  DateRangePicker,
  DateValue,
  RangeValue,
  Tooltip,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { start } from "repl";

interface IDateRangePickerProps {
  defatultDateRange: RangeValue<DateValue> | null;
  onChange: (value: { start: string; end: string }) => void;
  title?: string;
}

const DateRangeFilter: FC<IDateRangePickerProps> = ({
  defatultDateRange,
  onChange,
  title = "Duration",
}) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null,
  );

  useEffect(() => {
    setDateRange(defatultDateRange);
  }, [defatultDateRange]);

  const applyDateFilter = (days: number): void => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const newRange = {
      start: parseDate(startDate.toISOString().split("T")[0]),
      end: parseDate(endDate.toISOString().split("T")[0]),
    };

    setDateRange(newRange);

    onChange({
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    });
  };

  const isActiveFilter = (days: number): boolean => {
    if (!dateRange) return false;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const endDate = new Date();

    return (
      dateRange.start?.toString() ===
        parseDate(startDate.toISOString().split("T")[0]).toString() &&
      dateRange.end?.toString() ===
        parseDate(endDate.toISOString().split("T")[0]).toString()
    );
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex w-full gap-2 mb-2 justify-between">
        <Tooltip content="Filter for the last 1 day">
          <Button
            size="sm"
            radius="full"
            isIconOnly
            color="primary"
            variant={isActiveFilter(1) ? "solid" : "ghost"}
            onPress={() => applyDateFilter(1)}
          >
            1D
          </Button>
        </Tooltip>
        <Tooltip content="Filter for the last 1 week">
          <Button
            size="sm"
            radius="full"
            isIconOnly
            color="primary"
            variant={isActiveFilter(7) ? "solid" : "ghost"}
            onPress={() => applyDateFilter(7)}
          >
            1W
          </Button>
        </Tooltip>
        <Tooltip content="Filter for the last 1 month">
          <Button
            size="sm"
            radius="full"
            isIconOnly
            color="primary"
            variant={isActiveFilter(30) ? "solid" : "ghost"}
            onPress={() => applyDateFilter(30)}
          >
            1M
          </Button>
        </Tooltip>
        <Tooltip content="Filter for the last 3 months">
          <Button
            size="sm"
            radius="full"
            isIconOnly
            color="primary"
            variant={isActiveFilter(90) ? "solid" : "ghost"}
            onPress={() => applyDateFilter(90)}
          >
            3M
          </Button>
        </Tooltip>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker
        className="max-w-xs"
        // @ts-ignore
        value={dateRange}
        aria-label={title}
        label={title}
        onChange={(value: RangeValue<DateValue> | null): void => {
          const start = value?.start;
          const end = value?.end;
          setDateRange(value);
          if (start && end) {
            onChange({
              start: new Date(start.year, start.month - 1, start.day, 0, 0, 0)
                .toISOString()
                .split("T")[0],
              end: new Date(end.year, end.month - 1, end.day, 23, 59, 59)
                .toISOString()
                .split("T")[0],
            });
          }
        }}
      />
    </div>
  );
};

export default DateRangeFilter;
