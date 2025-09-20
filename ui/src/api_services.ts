import axios from "axios";

export const AxiosInstance = axios.create();

export interface IPostCall<TData> {
  success: number;
  message: string;
  data: TData;
  reason?: string;
  session?: string;
  count: number;
}

export interface ICreatePostRequest<TData> {
  data: TData;
}

export interface IUpdatePostRequest<TData, TFind> {
  data: TData;
  find: TFind;
}

export interface IDeletePostRequest<TFind> {
  find: TFind;
}

export interface IGetByIdPostRequest<TFind> {
  find: TFind;
}

export function postCall<TData>(
  url: string,
  requestBody: unknown,
): Promise<IPostCall<TData>> {
  return AxiosInstance.post(url, requestBody);
}
