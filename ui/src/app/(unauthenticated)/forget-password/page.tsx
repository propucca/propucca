"use client";

import React, { FC } from "react";
import { FormikProvider, useFormik } from "formik";
import { forgetPasswordValidationSchema } from "@/utils/validations/validation_schemas";
import InputField from "@/components/input";
import { Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api_config";
import { postCall } from "@/api_services";
import { errorMessage, successMessage } from "@/components/alert";
import { IForgetPassword, ILoginResp } from "@/utils/constants/interfaces";
import { CONFIG } from "@/config";

const ForgetPassword: FC = () => {
  const Router = useRouter();

  const forgotPasswordMutation = useMutation({
    mutationFn: (values: IForgetPassword) =>
      postCall<ILoginResp>(ENDPOINTS.SEND_OTP, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(resp.message);
        Router.push(
          `/change-password?email=${forgetPasswordForm.values.email}`,
        );
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

  const forgetPasswordForm = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordValidationSchema,
    onSubmit: (values): void => {
      forgotPasswordMutation.mutate(values);
    },
  });

  const OnEnter = (): void => {
    if (!forgotPasswordMutation.isPending) {
      forgetPasswordForm.handleSubmit();
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
        <div>
          <h2 className="text-xl text-primary font-semibold text-center mb-4 transition-opacity duration-700 opacity-80">
            Forget Password
          </h2>

          <p className="p-4 text-s font-small">
            Lost your password? Please enter your email address. You will
            receive a link to create a new password via email.
          </p>
          <div>
            <FormikProvider value={forgetPasswordForm}>
              <form className="flex flex-col gap-3">
                <InputField
                  name="email"
                  isRequired={true}
                  label="Email"
                  onChange={forgetPasswordForm.handleChange}
                  showError={true}
                  onEnter={OnEnter}
                />

                {forgotPasswordMutation.isPending ? (
                  <Spinner />
                ) : (
                  <Button
                    onPress={(): void => {
                      forgetPasswordForm.handleSubmit();
                    }}
                    color="primary"
                    className="transition-transform duration-300 ease-in-out hover:bg-teal-500 hover:scale-105"
                  >
                    Change Password
                  </Button>
                )}

                <Button
                  onPress={(): void => {
                    Router.push("/login/");
                  }}
                  color="default"
                  className="transition-transform duration-300 ease-in-out hover:500 hover:scale-105"
                >
                  Go Back
                </Button>
              </form>
            </FormikProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
