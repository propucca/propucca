"use client";

import React, { FC, useEffect, useState } from "react";
import AgGrid from "@/components/grid";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { columns } from "./grid-definitions";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { postCall } from "@/api_services";
import { ENDPOINTS } from "@/api_config";
import { errorMessage, warningMessage } from "@/components/alert";
import { useMutation } from "@tanstack/react-query";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/grid/actions";

const Roles: FC = () => {
  const [colDef, setColDef] = useState<ColDef[]>([]);
  const Router = useRouter();

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [records, setRecords] = useState<[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const getRolesMutation = useMutation({
    mutationFn: () =>
      postCall<[]>(ENDPOINTS.ROLES_GET_ALL, {
        find: {},
        pagination: true,
        paginationDetails: {
          limit,
          page: page - 1, // server side starts from zero
        },
        search: {
          role_name: search.length >= 3 ? search : undefined,
        },
        sort: {
          role_name: 1,
          modified_on: -1,
        },
      }),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        setRecords(resp.data);

        setTotalRecords(
          resp.count % limit === 0
            ? Number((resp.count / limit).toFixed())
            : parseInt((resp.count / limit).toString()) + 1,
        );
        setCount(resp.count);
      } else if (resp && resp.success === 0) {
        errorMessage(resp.message);
      } else {
        errorMessage("User fetch failed!.");
      }
    },
    onError: () => {
      errorMessage("User fetch failed!.");
    },
  });

  useEffect(() => {
    getRolesMutation.mutate();
  }, [page]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      getRolesMutation.mutate();
    }
  }, [limit]);

  const ActionRenderer: FC<ICellRendererParams> = ({ data, ...rest }) => {
    return (
      <div className="flex gap-2">
        <EditActionButton data={data} edit_url="/roles/role" {...rest} />
        <DeleteActionButton
          data={data}
          delete_url={ENDPOINTS.ROLES_DELETE}
          callBack={getRolesMutation.mutate}
          {...rest}
        />
      </div>
    );
  };

  useEffect(() => {
    columns.map((ele: ColDef) => {
      if (ele.field === "action") {
        ele.cellRenderer = ActionRenderer;
      }
    });
    setColDef(columns);
  }, [columns]);

  return (
    <div>
      <h1 className="font-medium text-xl text-primary text-center">
        Roles
        <Button
          className="float-right"
          size="sm"
          variant="ghost"
          color="primary"
          onClick={(): void => {
            Router.push("/roles/role");
          }}
        >
          Add Role
        </Button>
      </h1>
      <div className="h-[calc(100vh-270px)] ag-theme-quartz mt-2">
        <AgGrid
          columnDefs={colDef}
          rowData={records}
          // pagination
          onPageChange={setPage}
          onLimitChange={setLimit}
          page={page}
          pageSize={limit}
          totalRecords={totalRecords}
          count={count}
          showHeader
          gridName="roles"
          enableSearch={true}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by role name"
          onSearchEnter={(): void => {
            if (search !== "" && search.length < 3) {
              warningMessage("Please type at least 3 characters");
              return;
            } else {
              // reset page
              if (page === 1) {
                getRolesMutation.mutate();
              } else {
                setPage(1);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Roles;
