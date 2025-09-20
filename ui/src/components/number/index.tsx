// @ts-nocheck
import React, { forwardRef } from "react";

import { NumberInput } from "@heroui/react";
import { useField } from "formik";

interface INumberInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError: boolean;
  name: string;
  isRequired: boolean;
  endContent?: React.ReactNode;
  dataAtt?: string;
}

const NumberField = forwardRef<HTMLInputElement, INumberInput>(
  ({
    isRequired = false,
    name,
    placeholder,
    showError,
    label,
    endContent,
    dataAtt,
    ...rest
  }) => {
    const [field, meta] = useField({ name: name, ...rest });

    return (
      <NumberInput
        placeholder={placeholder}
        label={label}
        variant="bordered"
        name={field.name}
        isRequired={isRequired}
        isInvalid={meta.touched && meta.error && showError ? true : false}
        errorMessage={meta.touched && meta.error && showError ? meta.error : ""}
        endContent={endContent ? endContent : null}
        data-attr={dataAtt}
        {...rest}
      />
    );
  },
);

NumberField.displayName = "NumberField";

export default NumberField;
