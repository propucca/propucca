import { IUserPermissions } from "@/types/rbac";

export interface IUser {
  user_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role_id: number;
  role_name?: string;
  permissions?: IUserPermissions;
}

export interface ILoginResp extends IUser {
  id: string;
  access_token: string;
  bearer_token: string;
}

export interface IListingRequest {
  user_id: number;
  extras: {
    find: null;
    pagination: boolean;
    paginationDetails: {
      limit: number;
      pageSize: number;
    };
    sorting: boolean;
    sortingDetails: null;
  };
}

export interface IConfirmSignupReq {
  password: string;
  email: string | null;
  session: string | null;
}

export interface IChangePasswordReq {
  password: string;
  email: string | null;
  code: string;
}

export interface IForgetPassword {
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IGallery {
  id?: string;
  name: string;
  path?: string;
  image: string;
  is_generated?: boolean;
}
