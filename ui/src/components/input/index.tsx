// @ts-nocheck
import React, { forwardRef } from "react";

import { Input } from "@heroui/react";
import { useField } from "formik";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError: boolean;
  name: string;
  isRequired: boolean;
  endContent?: React.ReactNode;
  dataAtt?: string;
  onEnter?: () => void;
}

const InputField = forwardRef<HTMLInputElement, IInput>(
  ({
    isRequired = false,
    name,
    placeholder,
    showError,
    label,
    endContent,
    dataAtt,
    onEnter,
    ...rest
  }) => {
    const [field, meta] = useField({ name: name, ...rest });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        onEnter();
      }
    };

    return (
      <Input
        placeholder={placeholder}
        label={label}
        variant="bordered"
        name={field.name}
        isRequired={isRequired}
        isInvalid={meta.touched && meta.error && showError ? true : false}
        errorMessage={meta.touched && meta.error && showError ? meta.error : ""}
        endContent={endContent ? endContent : null}
        data-attr={dataAtt}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    );
  },
);

InputField.displayName = "Input";

export default InputField;
