/* eslint-disable */
// @ts-nocheck
import { D } from "@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o";
import { IAddress } from "./interfaces";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

/**
 * compare data from form and data from api, so if no changes detect we don't want to update form
 * @function DetectChangesInObj
 * @private
 * @param  {any} form  data from submitted form
 * @param  {any} data  data from api
 * @return {boolean}  two object same or not
 */
export const DetectChangesInObj = (form: any, data: any): boolean => {
  var changeDetect = false;
  for (const property in form) {
    if (form[property] !== data[property]) {
      changeDetect = true;
      break;
    }
  }

  return changeDetect;
};

/**
 * Converts a date string into a formatted date string (YYYY-MM-DD).
 *
 * @param date - The date string to be converted.
 * @returns The formatted date string in the format YYYY-MM-DD.
 */
export const ConvertDate = (date: string): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() < 9 ? `0${d.getMonth() + 1}` : d.getMonth() + 1}-${d.getDate() < 9 ? `0${d.getDate()}` : d.getDate()}`;
};

export const ExcelExport = ({ data, file_name }) => {
  const today = new Date();
  const timestamp = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${file_name}${timestamp}.xlsx`);
};
