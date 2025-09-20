"use client";

import { ColDef } from "ag-grid-community";

export const columns: ColDef[] = [
  {
    field: "role_name",
    headerName: "Role Name",
    filter: true,
  },
  {
    field: "permissions",
    headerName: "Permissions",
    filter: true,
  },
  {
    field: "action",
    headerName: "Action",
  },
];
