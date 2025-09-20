"use client";

import React, { FC, useEffect } from "react";
import { Button } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormikProvider, useFormik } from "formik";
import InputField from "@/components/input";
import { adminValidationSchema } from "@/utils/validations/validation_schemas";
import SelectField from "@/components/select";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api_config";
import {
  postCall,
  ICreatePostRequest,
  IUpdatePostRequest,
} from "@/api_services";
import { errorMessage, successMessage } from "@/components/alert";
import { Loader } from "@/components/loader";

// @ts-ignore
import UilArrowLeft from "@iconscout/react-unicons/icons/uil-arrow-circle-left";
import { DetectChangesInObj } from "@/utils/constants/constants";
import { IUser } from "@/utils/constants/interfaces";

const User: FC = () => {
  const Router = useRouter();
  const Params = useSearchParams();
  const QueryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: (values: IUpdatePostRequest<IUser, { id: string | null }>) =>
      postCall<[]>(ENDPOINTS.USERS_UPDATE, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(resp.message);
        (QueryClient.invalidateQueries({
          queryKey: ["user", Params.get("ref")],
        }),
          Router.push("/users/users-list"));
      } else if (resp && resp.success === 0) {
        errorMessage(resp.message);
      } else {
        errorMessage("User update failed!.");
      }
    },
    onError: () => {
      errorMessage("User update failed!.");
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (values: ICreatePostRequest<IUser>) =>
      postCall<[]>(ENDPOINTS.USERS_CREATE, values),
    onSuccess: (resp) => {
      if (resp && resp.success === 1) {
        successMessage(resp.message);
        Router.push("/users/users-list");
      } else if (resp && resp.success === 0) {
        errorMessage(resp.message);
      } else {
        errorMessage("User creation failed!.");
      }
    },
    onError: () => {
      errorMessage("User creation failed!.");
    },
  });

  const adminForm = useFormik({
    initialValues: {
      user_name: "",
      email: "",
      role_id: 0,
    },
    validationSchema: adminValidationSchema,
    onSubmit: (values): void => {
      if (Params.get("ref")) {
        // if update and no changes made
        if (!DetectChangesInObj(values, data?.data)) {
          errorMessage("You have not made any changes.");
          return;
        }

        updateUserMutation.mutate({
          data: values,
          find: { id: Params.get("ref") },
        });
      } else {
        addUserMutation.mutate({ data: values });
      }
    },
  });

  const { data } = useQuery({
    queryKey: ["user", Params.get("ref")],
    queryFn: () =>
      postCall<IUser>(ENDPOINTS.USERS_GET_BY_ID, {
        find: { id: Params.get("ref") },
      }),
    enabled: Params.get("ref") !== null && Params.get("ref") !== undefined,
  });

  useEffect(() => {
    if (data && data.success === 1) {
      adminForm.setValues(data.data);
    }
  }, [data]);

  return (
    <div>
      <h2 className="font-medium text-xl text-primary text-center">
        {Params.get("ref") ? "Update User" : "Create User"}
        <UilArrowLeft
          className="float-left ml-2"
          size="35"
          onClick={(): void => {
            Router.push("/users/users-list");
          }}
        ></UilArrowLeft>
      </h2>
      <FormikProvider value={adminForm}>
        <form className="flex flex-col gap-5 p-4 sm:p-2 lg:p-20">
          <InputField
            name="user_name"
            isRequired={true}
            label="User Name"
            onChange={adminForm.handleChange}
            showError={true}
            value={adminForm.values.user_name}
            type="text"
          />

          <InputField
            name="email"
            isRequired={true}
            label="User Email"
            onChange={adminForm.handleChange}
            showError={true}
            value={adminForm.values.email}
            disabled={!!Params.get("ref")}
          />

          <SelectField
            name="role_id"
            label="Select Role"
            options={[]}
            showError={true}
            isRequired={true}
            onChange={adminForm.handleChange}
            value={adminForm.values.role_id}
          />

          {!addUserMutation.isPending && !updateUserMutation.isPending ? (
            <Button
              className="mt-4"
              color="primary"
              onClick={(): void => {
                adminForm.handleSubmit();
              }}
            >
              {Params.get("ref") ? "Update" : "Create"}
            </Button>
          ) : (
            <Loader />
          )}
        </form>
      </FormikProvider>
    </div>
  );
};

export default User;
