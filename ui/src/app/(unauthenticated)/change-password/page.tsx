"use client";

import React, { FC, useState } from "react";
import { FormikProvider, useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { changePasswordValidationSchema } from "@/utils/validations/validation_schemas";
import InputField from "@/components/input";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api_config";
import { postCall } from "@/api_services";
import { errorMessage, successMessage } from "@/components/alert";
import { Loader } from "@/components/loader";
import {
  IChangePasswordReq,
  IConfirmSignupReq,
  ILoginResp,
} from "@/utils/constants/interfaces";

// @ts-ignore
import UilEye from "@iconscout/react-unicons/icons/uil-eye";

// @ts-ignore
import UilEyeslash from "@iconscout/react-unicons/icons/uil-eye-slash";

import { CONFIG } from "@/config";

const ChangePassword: FC = () => {
  const Router = useRouter();
  const Params = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const confirmSignupMutation = useMutation({
    mutationFn: (values: IConfirmSignupReq) =>
      postCall<ILoginResp>(ENDPOINTS.CONFIRM_SIGNUP, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(resp.message);
        Router.push("/login");
      } else if (resp && resp.success === 0) {
        errorMessage(resp.message);
      } else {
        errorMessage("Failed!");
      }
    },
    onError: () => {
      errorMessage("Failed!");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (values: IChangePasswordReq) =>
      postCall<ILoginResp>(ENDPOINTS.FORGOT_PASSWORD, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(resp.message);
        Router.push("/login");
      } else if (resp && resp.success === 0) {
        errorMessage(resp.message);
      } else {
        errorMessage("Failed!");
      }
    },
    onError: () => {
      errorMessage("Failed!");
    },
  });

  const changePasswordForm = useFormik({
    initialValues: {
      code: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: (values, helper): void => {
      if (!Params.get("session") && !values.code) {
        helper.setErrors({ code: "Please Enter Verification Code" });
        return;
      }

      // confirm signup
      if (Params.get("session")) {
        confirmSignupMutation.mutate({
          password: values.new_password,
          email: Params.get("email"),
          session: Params.get("session"),
        });
      } else {
        // forgot password change
        changePasswordMutation.mutate({
          password: values.new_password,
          email: Params.get("email"),
          code: values.code.toString(),
        });
      }
    },
  });

  const OnEnter = (): void => {
    if (!changePasswordMutation.isPending && !confirmSignupMutation.isPending) {
      changePasswordForm.handleSubmit();
    }
  };

  return (
    <div
      className="flex items-center flex-col w-full min-h-screen justify-center bg-center bg-cover relative"
      style={{ backgroundImage: `url(${CONFIG.LOGIN.BG})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="p-8 sm:p-12 sm:w-[40%] bg-white w-full rounded-lg shadow-xl z-10 transform transition-all duration-500 hover:scale-105">
        <div className="flex items-center justify-center mb-6 transition-transform duration-300 ease-in-out hover:rotate-6">
          <div
            className="bg-center bg-cover w-[150px] h-[150px] rounded-full shadow-lg border-4 border-gray-200"
            style={{ backgroundImage: `url(${CONFIG.LOGO})` }}
          ></div>
        </div>
        <h2 className="text-xl text-primary font-semibold text-center mb-4 transition-opacity duration-700 opacity-80">
          Change Password
        </h2>

        <div>
          <FormikProvider value={changePasswordForm}>
            <form className="flex flex-col gap-3">
              {!Params.get("session") && (
                <InputField
                  name="code"
                  isRequired={true}
                  label="Verification Code"
                  onChange={changePasswordForm.handleChange}
                  showError={!Params.get("session")}
                  onEnter={OnEnter}
                />
              )}

              <div className="relative">
                <InputField
                  name="new_password"
                  isRequired={true}
                  label="New Password"
                  onChange={changePasswordForm.handleChange}
                  showError={true}
                  type={showPassword ? "text" : "password"}
                  onEnter={OnEnter}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 p-0 bg-transparent border-none outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <UilEye color="grey" size="20" />
                      ) : (
                        <UilEyeslash color="grey" size="20" />
                      )}
                    </button>
                  }
                />
              </div>

              <div className="relative">
                <InputField
                  name="confirm_password"
                  isRequired={true}
                  label="Confirm Password"
                  onChange={changePasswordForm.handleChange}
                  showError={true}
                  type="password"
                  onEnter={OnEnter}
                />
              </div>

              {!changePasswordMutation.isPending ? (
                <Button
                  onPress={(): void => {
                    changePasswordForm.handleSubmit();
                  }}
                  color="primary"
                  className="transition-transform duration-300 ease-in-out hover:bg-teal-500 hover:scale-105"
                >
                  Submit
                </Button>
              ) : (
                <Loader />
              )}
            </form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
