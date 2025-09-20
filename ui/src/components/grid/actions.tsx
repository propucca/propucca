import React, { FC, useState } from "react";
// @ts-ignore
import UilEdit from "@iconscout/react-unicons/icons/uil-edit-alt";

// @ts-ignore
import UilTrash from "@iconscout/react-unicons/icons/uil-trash-alt";

// @ts-ignore
import UilConfirm from "@iconscout/react-unicons/icons/uil-check-circle";

// @ts-ignore
import UilCancel from "@iconscout/react-unicons/icons/uil-times-circle";

import { ICellRendererParams } from "ag-grid-community";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { IDeletePostRequest, postCall } from "@/api_services";
import { errorMessage, successMessage } from "../alert";
import { Spinner } from "@heroui/react";

import { CONFIG } from "@/config";

interface IEditActionButton extends ICellRendererParams {
  edit_url: string;
}

interface IDeleteActionButton extends ICellRendererParams {
  delete_url: string;
  callBack?: () => void;
}

export const EditActionButton: FC<IEditActionButton> = ({
  node,
  data,
  edit_url,
}) => {
  const Router = useRouter();

  return (
    <div
      attr-data={`productlist-action-icon-${node.rowIndex}`}
      className="cursor-pointer mt-2"
      onClick={(): void => {
        Router.push(`${edit_url}?ref=${data.id}`);
      }}
    >
      <UilEdit size="24" />
    </div>
  );
};

export const DeleteActionButton: FC<IDeleteActionButton> = ({
  node,
  data,
  delete_url,
  callBack,
}) => {
  const [deleteConfirm, setdeleteConfirm] = useState<boolean>(false);
  const deleteCallMutation = useMutation({
    mutationFn: (values: IDeletePostRequest<{ id: string[] }>) =>
      postCall<[]>(delete_url, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(resp.message);
        callBack && callBack();
      } else if (resp && resp.success === 0) {
        errorMessage(resp.message);
      } else {
        errorMessage("Delete failed!.");
      }
    },
    onError: () => {
      errorMessage("Delete failed!.");
    },
  });

  return (
    <div className="flex">
      {!deleteConfirm && (
        <div
          attr-data={`productlist-action-icon-${node.rowIndex}`}
          className="cursor-pointer mt-2"
          onClick={(): void => {
            setdeleteConfirm(true);
          }}
        >
          <UilTrash size="24" color="red" />
        </div>
      )}
      {deleteConfirm && !deleteCallMutation.isPending && (
        <div className="flex gap-2 justify-between">
          <div
            attr-data={`productlist-action-icon-${node.rowIndex}`}
            className="cursor-pointer mt-2"
            onClick={(): void => {
              const payload = {
                find: { id: [data.id] },
              };

              deleteCallMutation.mutate(payload);
            }}
          >
            <UilConfirm size="24" color="red" />
          </div>

          <div
            attr-data={`productlist-action-icon-${node.rowIndex}`}
            className="cursor-pointer mt-2"
            onClick={(): void => {
              setdeleteConfirm(false);
            }}
          >
            <UilCancel size="24" color="green" />
          </div>
        </div>
      )}
      {deleteCallMutation.isPending && <Spinner />}
    </div>
  );
};

export const PriceFormatter: FC<ICellRendererParams> = ({ value }) => {
  return (
    <div className="flex gap-1 font-bold">
      {CONFIG["CURRENCY"]["SYMBOL"]} {value}
    </div>
  );
};

export const DateFormatter: FC<ICellRendererParams> = ({ value }) => {
  return <div>{value ? new Date(value).toLocaleString() : ""}</div>;
};
