// @ts-nocheck
import React, { forwardRef } from "react";

import { Textarea } from "@heroui/react";
import { useField } from "formik";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError: boolean;
  name: string;
  isRequired: boolean;
}

const TextAreaField = forwardRef<HTMLInputElement, IInput>(
  ({ isRequired = false, name, placeholder, showError, label, ...rest }) => {
    const [field, meta] = useField({ name: name, ...rest });

    return (
      <Textarea
        placeholder={placeholder}
        label={label}
        variant="bordered"
        name={field.name}
        isRequired={isRequired}
        isInvalid={meta.touched && meta.error && showError ? true : false}
        errorMessage={meta.touched && meta.error && showError ? meta.error : ""}
        {...rest}
      />
    );
  },
);

TextAreaField.displayName = "TextArea";

export default TextAreaField;
