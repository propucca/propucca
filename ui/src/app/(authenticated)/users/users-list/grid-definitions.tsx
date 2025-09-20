"use client";

import { ColDef } from "ag-grid-community";

export const columns: ColDef[] = [
  {
    field: "user_name",
    headerName: "Name",
    filter: true,
  },
  {
    field: "email",
    headerName: "Email",
    filter: true,
  },
  {
    field: "role_name",
    headerName: "Role",
    filter: true,
  },
  {
    field: "action",
    headerName: "Action",
  },
];
