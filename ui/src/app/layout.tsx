// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
// import type { Metadata } from "next";
import "./globals.css";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import QueryProvider from "./QueryProvider";
import { UserDataProvider } from "@/utils/contexts";
import { clearAll, getItem } from "@/utils/localstorage";
import { ToastProvider } from "@heroui/toast";
import { VendorDataProvider } from "@/utils/contexts/filter_vendor";
import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
} from "ag-grid-community";
import { CONFIG } from "@/config";
import { HeroUIProvider } from "@heroui/react";
import { AxiosInstance } from "@/api_services";
import { errorMessage } from "@/components/alert";
import { useTheme } from "@/hooks/useTheme";
import "@/styles/themes.css";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: "legacy" });

// const metadata: Metadata = {
//   title: "Store front",
//   description: "",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const Router = useRouter();
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!getItem("token")) {
      Router.push("/login/");
    }

    const reqIntercept = AxiosInstance.interceptors.request.use((request) => {
      const token = getItem("token");
      const access_token = getItem("access_token");

      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
      if (access_token) {
        request.headers.set("Access", `${access_token}`);
      }

      return request;
    });

    const respIntercept = AxiosInstance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (
          (error && error.statusCode === 401) ||
          (error && error.response && error.response.status === 403) ||
          (error && error.code === "ERR_NETWORK")
        ) {
          clearAll();
          errorMessage("Session Expired! Please login again!");
          Router.push("/login/");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      AxiosInstance.interceptors.request.eject(reqIntercept);
      AxiosInstance.interceptors.response.eject(respIntercept);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={CONFIG.FAVICON.FAVICON_IMAGE} sizes="32x32" />
        <title>{CONFIG.FAVICON.TITLE}</title>
      </head>
      <body>
        <>
          <UserDataProvider>
            <VendorDataProvider>
              <QueryProvider>
                <HeroUIProvider>
                  <main className={currentTheme}>
                    <ToastProvider placement={"top-right"} toastOffset={30} />
                    {children}
                  </main>
                </HeroUIProvider>
              </QueryProvider>
            </VendorDataProvider>
          </UserDataProvider>
        </>
      </body>
    </html>
  );
}
