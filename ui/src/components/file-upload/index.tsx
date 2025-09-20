// @ts-nocheck
import React, { forwardRef, useRef } from "react";

import { Image } from "@heroui/react";
import { useField } from "formik";
// @ts-ignore
import UilRemove from "@iconscout/react-unicons/icons/uil-file-times";
import { errorMessage } from "../alert";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError: boolean;
  name: string;
  allowedFiles: string[];
  maxFileSizeinKB?: number;
}

const FileUpload = forwardRef<HTMLInputElement, IInput>(
  ({
    name,
    showError,
    label,
    allowedFiles,
    value,
    maxFileSizeinKB = 1024,
    ...rest
  }) => {
    const [field, meta, change] = useField({ name: name, ...rest });

    const inputRef = useRef();
    return (
      <>
        <input
          ref={inputRef}
          name={name}
          type="file"
          disabled={rest.disabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const reader = new FileReader();
            const file = event.target.files[0];

            if (maxFileSizeinKB < file.size / 1024) {
              errorMessage(
                `File Size Cannot be more that ${maxFileSizeinKB}KB`,
              );
              return;
            }

            if (reader !== undefined && file !== undefined) {
              reader.onloadend = (): void => {
                change.setValue(reader.result?.toString());
              };
              reader.readAsDataURL(file);
            }
          }}
          accept={allowedFiles}
          style={{ display: "none" }}
        />

        <div
          className="border-1 border-primary rounded-lg border-dashed text-center p-5 cursor-pointer"
          onClick={() => {
            inputRef?.current.click();
          }}
        >
          {`Click here to upload \n
            ${label}\n
            Supported Files ${allowedFiles.join("/")}
            `}
        </div>
        {field.value && (
          <div className="flex">
            <Image width={500} height={500} src={value || null} alt="none" />
            {!rest.disabled && (
              <UilRemove
                size="50"
                color="red"
                className="cursor-pointer"
                onClick={() => {
                  change.setValue("");
                }}
              />
            )}
          </div>
        )}
        {meta.error && showError && (
          <span className="text-danger">{meta.error}</span>
        )}
      </>
    );
  },
);

FileUpload.displayName = "File";

export default FileUpload;
