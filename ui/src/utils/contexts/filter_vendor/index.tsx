//@ts-nocheck
/* eslint-disable */
"use client";
import React, { createContext, useState, FC } from "react";
import { IVendor } from "@/app/(authenticated)/vendors/vendor/page";

const initialValue = {
  vendor_name: "",
  super_user_email: "",
  vendor_description: "",
  id: "",
};

const initialConext = {
  selectedVendor: initialValue,
  vendorList: [],
  setVendorData: (value: IVendor[]): void => {},
  setSelectedVendor: (value: IVendor): void => {},
};

const VendorDataContext = createContext(initialConext);

const VendorDataProvider: FC = ({ children }) => {
  const [vendorList, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(initialValue);

  return (
    <VendorDataContext.Provider
      value={{ vendorList, selectedVendor, setVendorData, setSelectedVendor }}
    >
      {children}
    </VendorDataContext.Provider>
  );
};

export { VendorDataProvider, VendorDataContext };
