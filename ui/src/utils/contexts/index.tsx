//@ts-nocheck
/* eslint-disable */
"use client";
import React, { createContext, useState, FC, useEffect } from "react";
import { getItem } from "../localstorage";
import { IUser } from "../constants/interfaces";
import { IUserPermissions, DEFAULT_ROLES, RoleName } from "@/types/rbac";

const initialValue = {
  admin_name: "",
  email: "",
  phone_number: "",
  access_token: "",
  bearer_token: "",
  vendor_id: "",
  id: "",
  is_app_admin: false,
  user_type: "",
  permissions: {
    role: {
      name: "norole",
      description: "",
      permissions: [],
    },
    custom_permissions: [] as string[],
  } as IUserPermissions | null,
};

const initialConext = {
  userData: initialValue,
  setUserData: (value: IUser): void => {},
};

const UserDataContext = createContext(initialConext);

const UserDataProvider: FC = ({ children }) => {
  const [userData, setUserData] = useState({
    admin_name: getItem("name"),
    email: getItem("email"),
    access_token: getItem("access_token"),
    bearer_token: getItem("token"),
    vendor_id: getItem("vendor_id"),
    id: getItem("user_id"),
    is_app_admin: JSON.parse(getItem("is_admin")),
    user_type: getItem("user_type"),
    permissions: null as IUserPermissions | null,
  });

  return (
    <UserDataContext.Provider value={{ setUserData, userData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export { UserDataProvider, UserDataContext };
