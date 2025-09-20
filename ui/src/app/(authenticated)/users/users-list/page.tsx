"use client";

import React, { FC, useEffect, useState, useContext } from "react";
import AgGrid from "@/components/grid";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { columns } from "./grid-definitions";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { postCall } from "@/api_services";
import { ENDPOINTS } from "@/api_config";
import { errorMessage, warningMessage } from "@/components/alert";
import { useMutation } from "@tanstack/react-query";

import { VendorDataContext } from "@/utils/contexts/filter_vendor";

import {
  DeleteActionButton,
  EditActionButton,
} from "@/components/grid/actions";

const Admins: FC = () => {
  const [colDef, setColDef] = useState<ColDef[]>([]);
  const Router = useRouter();

  // pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [records, setRecords] = useState<[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const { selectedVendor } = useContext(VendorDataContext);

  const getAdminsMutation = useMutation({
    mutationFn: () =>
      postCall<[]>(ENDPOINTS.USERS_GET_ALL, {
        find: { vendor_id: selectedVendor.id ? selectedVendor.id : undefined },
        pagination: true,
        paginationDetails: {
          limit,
          page: page - 1, // server side starts from zero
        },
        search: {
          admin_name: search.length >= 3 ? search : undefined,
        },
        sort: {
          admin_name: 1,
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
        errorMessage("Admin fetch failed!.");
      }
    },
    onError: () => {
      errorMessage("Admin fetch failed!.");
    },
  });

  useEffect(() => {
    getAdminsMutation.mutate();
  }, [page, selectedVendor]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      getAdminsMutation.mutate();
    }
  }, [limit]);

  const ActionRenderer: FC<ICellRendererParams> = ({ data, ...rest }) => {
    return (
      <div className="flex gap-2">
        <EditActionButton data={data} edit_url="/admins/admin" {...rest} />
        <DeleteActionButton
          data={data}
          delete_url={ENDPOINTS.USERS_DELETE}
          callBack={getAdminsMutation.mutate}
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
        Admins
        <Button
          className="float-right"
          size="sm"
          variant="ghost"
          color="primary"
          onClick={(): void => {
            Router.push("/admins/admin");
          }}
        >
          Add Admin
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
          gridName="admins"
          enableSearch={true}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by admin name"
          onSearchEnter={(): void => {
            if (search !== "" && search.length < 3) {
              warningMessage("Please type at least 3 characters");
              return;
            } else {
              // reset page
              if (page === 1) {
                getAdminsMutation.mutate();
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

export default Admins;
