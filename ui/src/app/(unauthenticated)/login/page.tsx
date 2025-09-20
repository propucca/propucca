"use client";

import React, { FC, useContext, useEffect, useState } from "react";

import { Button } from "@heroui/react";
import { FormikProvider, useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import InputField from "@/components/input";
import { loginValidationSchema } from "@/utils/validations/validation_schemas";
import { ENDPOINTS } from "@/api_config";
import { postCall } from "@/api_services";
import { errorMessage, warningMessage } from "@/components/alert";
import { Loader } from "@/components/loader";
import { ILogin, ILoginResp } from "@/utils/constants/interfaces";
import { setItem } from "@/utils/localstorage";
import { UserDataContext } from "@/utils/contexts";

// @ts-ignore
import UilEye from "@iconscout/react-unicons/icons/uil-eye";
// @ts-ignore
import UilEyeslash from "@iconscout/react-unicons/icons/uil-eye-slash";
import { CONFIG } from "@/config";
import { DEFAULT_ROLES } from "@/types/rbac";

const Login: FC = () => {
  const Router = useRouter();

  const { setUserData } = useContext(UserDataContext);
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  // remove all
  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  const loginMutation = useMutation({
    mutationFn: (values: ILogin) =>
      postCall<ILoginResp>(ENDPOINTS.LOGIN, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        const userData = resp.data;
        // CHANGE HERE
        // CHANGE
        setUserData({
          ...userData,
          permissions: {
            role: {
              name: "admin",
              description: DEFAULT_ROLES["admin"].description,
              permissions: DEFAULT_ROLES["admin"].permissions,
            },
          },
        });
        // CHANGE HERE
        setItem("name", userData.user_name);
        setItem("email", userData.email);
        setItem("token", userData.bearer_token); // change to bearer token
        setItem("access_token", userData.access_token);
        setItem("role_id", JSON.stringify(userData.role_id));
        setItem("user_id", userData.id);
        setItem("permissions", JSON.stringify([]));

        Router.push("/roles/role"); // chnge to dashboard
      } else if (resp && resp.success === 0) {
        if (resp.reason === "NEW_PASSWORD_REQUIRED") {
          warningMessage(resp.message);
          Router.push(
            `/change-password?session=${resp.session}&email=${regForm.values.username}`,
          );
        } else {
          errorMessage(resp.message);
        }
      } else {
        errorMessage("Login Failed!.Check your credentials!");
      }
    },
    onError: () => {
      errorMessage("Login Failed!.Check your credentials!");
    },
  });

  const regForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values): void => {
      loginMutation.mutate({
        email: values.username,
        password: values.password,
      });
    },
  });

  const OnEnter = (): void => {
    if (!loginMutation.isPending) {
      regForm.handleSubmit();
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
            data-attr="login-logo"
            style={{ backgroundImage: `url(${CONFIG.LOGO})` }}
          ></div>
        </div>
        <h2
          className="text-xl text-primary font-semibold text-center mb-4 transition-opacity duration-700 opacity-80"
          data-attr="login-heading-h2"
        >
          Welcome Back!
        </h2>

        <FormikProvider value={regForm}>
          <form className="flex flex-col gap-3" data-attr="login-form">
            <div data-attr="login-email-field">
              <InputField
                name="username"
                isRequired={true}
                label="Email"
                onChange={regForm.handleChange}
                showError={true}
                onEnter={OnEnter}
              />
            </div>

            <div className="relative" data-attr="login-password-field">
              <InputField
                name="password"
                type={showPassword ? "text" : "password"}
                isRequired={true}
                label="Password"
                onChange={regForm.handleChange}
                showError={true}
                onEnter={OnEnter}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 p-0 bg-transparent border-none outline-none cursor-pointer"
                    data-attr="login-password-toggle"
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

            {loginMutation.isPending ? (
              <Loader />
            ) : (
              <div data-attr="login-submit-button">
                <Button
                  onClick={(): void => {
                    regForm.handleSubmit();
                  }}
                  color="primary"
                  className="w-full transition-transform duration-300 ease-in-out hover:bg-teal-500 hover:scale-105"
                >
                  Login
                </Button>
              </div>
            )}
          </form>
        </FormikProvider>
        <div className="flex items-center justify-end p-5 cursor-pointer hover:text-teal-500">
          <h2
            data-attr="login-forgot-h2"
            onClick={(): void => {
              Router.push("/forget-password/");
            }}
          >
            Lost your password?..
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Login;
