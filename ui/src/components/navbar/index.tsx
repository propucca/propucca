import React, { FC, useContext, useEffect, useState } from "react";

import {
  Navbar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Chip,
  Divider,
} from "@heroui/react";

import { UserDataContext } from "@/utils/contexts";
import { VendorDataContext } from "@/utils/contexts/filter_vendor";
import { clearAll } from "@/utils/localstorage";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { postCall } from "@/api_services";
// import { ENDPOINTS } from "@/api_config";
// @ts-ignore
import UilHamburger from "@iconscout/react-unicons/icons/uil-bars";
// import UilClose from "@iconscout/react-unicons/icons/uil-times-circle";
// @ts-ignore
import UilUser from "@iconscout/react-unicons/icons/uil-user";
// @ts-ignore
import UilSignout from "@iconscout/react-unicons/icons/uil-signout";
// @ts-ignore
import UilBell from "@iconscout/react-unicons/icons/uil-bell";
// @ts-ignore
import UilSetting from "@iconscout/react-unicons/icons/uil-setting";
// import DropdownField from "@/components/dropdown";
// import { IOption } from "@/components/dropdown";
import { useQueryClient } from "@tanstack/react-query";
import { CONFIG } from "@/config";

interface IAvatar {
  logout: () => void;
}

interface IRespNavBar {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const RespNavBar: FC<IRespNavBar> = ({ isOpen, setOpen }) => {
  const Router = useRouter();
  const pathname = usePathname();

  // const [vendorDropdown, setVendorDropdown] = useState<IOption[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { setSelectedVendor, setVendorData } = useContext(VendorDataContext);
  const { userData, setUserData } = useContext(UserDataContext);

  const queryClient = useQueryClient();

  // Get current page title from pathname
  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "Dashboard";

    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // useEffect(() => {
  //   if (vendorList && vendorList.length) {
  //     setVendorDropdown([
  //       ...vendorList.map((ele: IVendor) => {
  //         return { label: ele.vendor_name, value: ele.id };
  //       }),
  //     ]);
  //   }
  // }, [vendorList]);

  const logout = (): void => {
    clearAll();
    setSelectedVendor({
      id: "",
      vendor_name: "",
      vendor_description: "",
      super_user_email: "",
      vendor_logo: "",
    });
    setUserData({
      user_name: "",
      email: "",
      role_id: 0,
    });
    queryClient.invalidateQueries();
    Router.push("/login/");
  };

  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      postCall<[]>("", {
        find: {},
        pagination: false,
        paginationDetails: {
          limit: 100,
          pageSize: 1,
        },
        search: [],
        sort: {
          created_on: 1,
        },
      }),
    enabled: userData && userData.is_app_admin === true,
  });

  useEffect(() => {
    if (data?.success === 1 && data.data.length) {
      setVendorData(data.data);
    }
  }, [data]);

  return (
    <Navbar
      className="header bg-gradient-to-r from-primary to-secondary text-white shadow-lg border-b-2 border-lightSecondary"
      maxWidth="full"
      height="4rem"
    >
      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        {/* Sidebar Toggle */}
        <Button
          isIconOnly
          variant="light"
          className="text-white hover:bg-white/20 transition-colors"
          onClick={() => setOpen(!isOpen)}
        >
          <UilHamburger size="24" />
        </Button>

        {/* Logo and Brand */}
        <div className="flex items-center gap-3 logo-container">
          <div
            className="bg-center bg-cover w-10 h-10 rounded-full shadow-lg border-2 border-white/30"
            style={{ backgroundImage: `url(${CONFIG.LOGO})` }}
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white">
              {CONFIG.FAVICON.TITLE}
            </h1>
            <p className="text-xs text-white/80">Admin Panel</p>
          </div>
        </div>

        {/* Page Title */}
        <div className="hidden lg:flex items-center ml-8">
          <Chip
            variant="flat"
            className="bg-white/20 text-white border-white/30"
            size="sm"
          >
            {getPageTitle()}
          </Chip>
        </div>
      </NavbarContent>

      {/* Mobile Navigation */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          className="text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <div className="flex items-center gap-2 ml-2 logo-container">
          <div
            className="bg-center bg-cover w-8 h-8 rounded-full shadow-lg border-2 border-white/30"
            style={{ backgroundImage: `url(${CONFIG.LOGO})` }}
          />
          <span className="text-sm font-semibold text-white">
            {CONFIG.FAVICON.TITLE}
          </span>
        </div>
      </NavbarContent>

      {/* <NavbarContent className="hidden lg:flex content-center">
            <div className="flex items-center gap-2">
              <DropdownField
                buttonLabel="Select Vendor"
                options={vendorDropdown}
                selected={
                  selectedVendor
                    ? {
                        label: selectedVendor.vendor_name,
                        value: selectedVendor.id,
                      }
                    : {}
                }
                onSelect={(event: IOption) => {
                  setSelectedVendor(
                    vendorList.filter(
                      (ele) => ele.id === event.value,
                    )[0],
                  );
                }}
              />
              {selectedVendor && selectedVendor.id && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-red-400 hover:bg-red-400/20"
                  onClick={(): void => {
                    setSelectedVendor({
                      vendor_name: "",
                      vendor_description: "",
                      super_user_email: "",
                      id: "",
                      vendor_logo: "",
                    });
                  }}
                >
                  <UilClose size="16" />
                </Button>
              )}
            </div>
          </NavbarContent>
         */}

      {/* Right Side Actions */}
      <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              isIconOnly
              variant="light"
              className="text-white hover:bg-white/20 transition-colors notification-badge"
            >
              <UilBell size="20" />
            </Button>

            {/* Settings */}
            <Button
              isIconOnly
              variant="light"
              className="text-white hover:bg-white/20 transition-colors"
            >
              <UilSetting size="20" />
            </Button>

            {/* User Avatar */}
            <UserAvatar logout={logout} />
          </div>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-gradient-to-b from-primary to-secondary text-white p-0">
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3 mb-3 logo-container">
            <div
              className="bg-center bg-cover w-12 h-12 rounded-full shadow-lg border-2 border-white/30"
              style={{ backgroundImage: `url(${CONFIG.LOGO})` }}
            />
            <div>
              <h2 className="text-lg font-bold text-white">
                {CONFIG.FAVICON.TITLE}
              </h2>
              <p className="text-sm text-white/80">Admin Panel</p>
            </div>
          </div>

          {/* Mobile Page Title */}
          <Chip
            variant="flat"
            className="bg-white/20 text-white border-white/30"
            size="sm"
          >
            {getPageTitle()}
          </Chip>
        </div>

        {/* <div className="p-4 border-b border-white/20">
              <div className="flex items-center gap-2">
                <DropdownField
                  buttonLabel="Select Vendor"
                  options={vendorDropdown}
                  selected={
                    selectedVendor
                      ? {
                          label: selectedVendor.vendor_name,
                          value: selectedVendor.id,
                        }
                      : {}
                  }
                  onSelect={(event: IOption) => {
                    setSelectedVendor(
                      vendorList.filter(
                        (ele: IVendor) => ele.id === event.value,
                      )[0],
                    );
                  }}
                />
                {selectedVendor && selectedVendor.id && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-red-400 hover:bg-red-400/20"
                    onClick={(): void => {
                      setSelectedVendor({
                        vendor_name: "",
                        vendor_description: "",
                        super_user_email: "",
                        id: "",
                        vendor_logo: "",
                      });
                    }}
                  >
                    <UilClose size="16" />
                  </Button>
                )}
              </div>
            </div> */}

        {/* Navigation Items */}
        <div className="flex-1 p-4">
          <NavbarItem>
            <Button
              variant="light"
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={(): void => Router.push("/home/")}
            >
              Home
            </Button>
          </NavbarItem>

          {userData?.is_app_admin && (
            <NavbarItem>
              <Button
                variant="light"
                className="w-full justify-start text-white hover:bg-white/20"
                onClick={(): void => Router.push("/admins/admins-list/")}
              >
                Admins
              </Button>
            </NavbarItem>
          )}

          {userData?.is_app_admin &&
            !CONFIG.DISABLED_FEATURES.includes("Vendors") && (
              <NavbarItem>
                <Button
                  variant="light"
                  className="w-full justify-start text-white hover:bg-white/20"
                  onClick={(): void => Router.push("/vendors/vendors-list/")}
                >
                  Vendors
                </Button>
              </NavbarItem>
            )}

          <NavbarItem>
            <Button
              variant="light"
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={(): void => Router.push("/products/products-list")}
            >
              Products
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Button
              variant="light"
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={(): void => Router.push("/categories/category-list")}
            >
              Categories
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Button
              variant="light"
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={(): void => Router.push("/orders/orders-list")}
            >
              Orders
            </Button>
          </NavbarItem>

          {userData?.is_app_admin && (
            <NavbarItem>
              <Button
                variant="light"
                className="w-full justify-start text-white hover:bg-white/20"
                onClick={(): void => Router.push("/coupons/coupons-list")}
              >
                Coupons
              </Button>
            </NavbarItem>
          )}

          {userData?.is_app_admin && (
            <NavbarItem>
              <Button
                variant="light"
                className="w-full justify-start text-white hover:bg-white/20"
                onClick={(): void => Router.push("/delivery-days")}
              >
                Delivery Days
              </Button>
            </NavbarItem>
          )}

          {userData?.is_app_admin &&
            [
              "shippings/shippings-list",
              "reviews/reviews-list",
              "customers/customers-list",
              "banners/banners-list",
              "gallery",
              "newsletters/newsletters-list",
            ].map((path) => (
              <NavbarItem key={path}>
                <Button
                  variant="light"
                  className="w-full justify-start text-white hover:bg-white/20"
                  onClick={(): void => Router.push(`/${path}`)}
                >
                  {path.split("/")[0].charAt(0).toUpperCase() +
                    path.split("/")[0].slice(1)}
                </Button>
              </NavbarItem>
            ))}
        </div>

        {/* Mobile User Info and Logout */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              className="text-lg"
              color="success"
              size="md"
              name={
                userData?.admin_name
                  ? userData.admin_name.slice(0, 1).toUpperCase()
                  : "UU"
              }
            />
            <div className="flex-1">
              <div className="font-medium text-white">
                {userData?.admin_name}
              </div>
              <div className="text-sm text-white/80">{userData?.email}</div>
            </div>
          </div>

          <Button
            variant="light"
            className="w-full justify-start text-red-400 hover:bg-red-400/20"
            onClick={logout}
            startContent={<UilSignout size="16" />}
          >
            Sign Out
          </Button>
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

const UserAvatar: FC<IAvatar> = ({ logout }) => {
  const { userData } = useContext(UserDataContext);

  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          variant="light"
          className="p-0 min-w-0 h-auto bg-transparent hover:bg-white/20"
        >
          <Avatar
            className="cursor-pointer text-lg border-2 border-white/30"
            color="success"
            size="md"
            name={
              userData?.admin_name
                ? userData.admin_name.slice(0, 1).toUpperCase()
                : "UU"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <div className="p-4 min-w-[200px]">
          {/* User Info Header */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              className="text-lg"
              color="success"
              size="md"
              name={
                userData?.admin_name
                  ? userData.admin_name.slice(0, 1).toUpperCase()
                  : "UU"
              }
            />
            <div className="flex-1">
              <div className="font-semibold text-textColor">
                {userData?.admin_name}
              </div>
              <div className="text-sm text-textGray">{userData?.email}</div>
            </div>
          </div>

          <Divider className="my-3" />

          {/* User Role */}
          <div className="mb-3">
            <Chip
              size="sm"
              variant="flat"
              className="bg-primary/10 text-primary"
            >
              {userData?.is_app_admin ? "App Admin" : "Admin"}
            </Chip>
          </div>

          <Divider className="my-3" />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="light"
              className="w-full justify-start text-textColor hover:bg-lightSecondary"
              startContent={<UilUser size="16" />}
            >
              Profile
            </Button>

            <Button
              variant="light"
              className="w-full justify-start text-textColor hover:bg-lightSecondary"
              startContent={<UilSetting size="16" />}
            >
              Settings
            </Button>

            <Button
              variant="light"
              className="w-full justify-start text-red-500 hover:bg-red-50"
              onClick={logout}
              startContent={<UilSignout size="16" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RespNavBar;
