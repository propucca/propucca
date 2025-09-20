import React, { FC } from "react";

import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { Button, Pagination, Select, SelectItem } from "@heroui/react";
import { ExcelExport } from "@/utils/constants/constants";

import { ColDef } from "ag-grid-community";
import GridSearch, { IGridSearch } from "./search";

interface IGrid extends AgGridReactProps, IPagination, IGridSearch {
  enableSearch?: boolean;
}

interface IPagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  count: number;
  showHeader?: boolean;
  gridName?: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface IGridHeader extends IGridSearch {
  onExport: () => void;
  disableExport?: boolean;
  page: number;
  pageSize: number;
  count: number;
  currentPageCount: number;
  enableSearch?: boolean;
}

const AgGrid: FC<IGrid> = ({
  onPageChange,
  onLimitChange,
  page,
  pageSize,
  totalRecords,
  count,
  gridName = "grid",
  showHeader = false,
  enableSearch = false,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onSearchEnter,
  ...rest
}) => {
  const onExport = (): void => {
    const columnMapping: {
      [key: string]: string;
    } = {};

    rest.columnDefs?.forEach((item: ColDef) => {
      if (item.field && item.headerName) {
        columnMapping[item.field] = item.headerName;
      }
    });

    const data = rest.rowData?.map((item) => {
      var obj: { [key: string]: string | undefined | {} } = {};
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === "object") {
          obj = { ...obj, ...value };
          delete obj._id; // _id not required
        } else {
          if (columnMapping[key]) {
            obj[columnMapping[key]] =
              columnMapping[key].toLocaleLowerCase().includes("date") &&
              value &&
              (typeof value === "string" || typeof value === "number") &&
              !isNaN(new Date(value).getTime())
                ? `${new Date(value).toLocaleDateString()} ${new Date(value).toLocaleTimeString()}`
                : value;
          }
        }
      });
      return obj;
    });
    ExcelExport({ data, file_name: gridName });
  };

  return (
    <>
      {showHeader && (
        <GridHeader
          page={page}
          pageSize={pageSize}
          count={count}
          currentPageCount={rest.rowData?.length ?? 0}
          onExport={onExport}
          enableSearch={enableSearch}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onSearchEnter={onSearchEnter}
          searchPlaceholder={searchPlaceholder}
          disableExport={!(rest.rowData && rest.rowData?.length > 0)}
        />
      )}
      <AgGridReact
        gridOptions={{
          autoSizeStrategy: {
            type: "fitGridWidth",
          },
        }}
        pagination={false}
        // onPaginationChanged={onPaginationChanged}
        {...rest}
      />
      <GridPagination
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        count={count}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </>
  );
};

const GridPagination: FC<IPagination> = ({
  page,
  totalRecords,
  pageSize,
  onPageChange,
  onLimitChange,
}) => {
  return (
    <div className="flex w-full justify-between p-3 bg-white rounded-br-md rounded-bl-md shadow-md">
      <Pagination
        onChange={(page: number): void => {
          onPageChange(page);
        }}
        variant="faded"
        className="w-full"
        color="primary"
        size="sm"
        page={page}
        total={totalRecords}
      />

      <Select
        defaultSelectedKeys={["20"]}
        onSelectionChange={(keys): void => {
          if (!keys.anchorKey) return;
          onLimitChange(Number(keys.anchorKey));
        }}
        variant="faded"
        size="sm"
        className="w-64"
        label="Page Size"
        selectedKeys={[pageSize.toString()]}
      >
        <SelectItem key={"20"}>20 Rows</SelectItem>
        <SelectItem key={"50"}>50 Rows</SelectItem>
        <SelectItem key={"100"}>100 Rows</SelectItem>
      </Select>
    </div>
  );
};

const GridHeader: FC<IGridHeader> = ({
  onExport,
  page,
  pageSize,
  count,
  currentPageCount,
  enableSearch,
  searchValue,
  onSearchChange,
  onSearchEnter,
  searchPlaceholder,
  disableExport = false,
}) => {
  return (
    <div className="flex w-full justify-between p-2 rounded-tl-md rounded-tr-md shadow-md shadow-gray-300">
      <div className="flex gap-3">
        <div className="text-xl font-bold">{`${(page - 1) * pageSize + currentPageCount}/${count}`}</div>
        {enableSearch && (
          <GridSearch
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            onSearchEnter={onSearchEnter}
            searchPlaceholder={searchPlaceholder}
          />
        )}
      </div>
      <Button
        onPress={onExport}
        isDisabled={disableExport}
        size="sm"
        color="primary"
      >
        Export as Excel
      </Button>
    </div>
  );
};

export default AgGrid;
