import { CONFIG } from "./config";

const BASE_URL = CONFIG.API_URL;

export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,

  CONFIRM_SIGNUP: `${BASE_URL}/auth/confirmSignup`,
  SEND_OTP: `${BASE_URL}/auth/send-otp`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forget-password`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/changePassword`,

  // users
  USERS_CREATE: `${BASE_URL}/users/create`,
  USERS_UPDATE: `${BASE_URL}/users/update`,
  USERS_DELETE: `${BASE_URL}/users/delete`,
  USERS_GET_ALL: `${BASE_URL}/users/getall`,
  USERS_GET_BY_ID: `${BASE_URL}/users/getbyid`,

  // roles
  ROLES_CREATE: `${BASE_URL}/roles/create`,
  ROLES_UPDATE: `${BASE_URL}/roles/update`,
  ROLES_DELETE: `${BASE_URL}/roles/delete`,
  ROLES_GET_ALL: `${BASE_URL}/roles/getall`,
  ROLES_GET_BY_ID: `${BASE_URL}/roles/getbyid`,
};
