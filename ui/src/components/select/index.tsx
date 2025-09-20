// @ts-nocheck
import React, { forwardRef } from "react";
import { Select, SelectItem } from "@heroui/react";
import { useField } from "formik";

interface IOption {
  id: string;
  name: string;
}

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  showError: boolean;
  name: string;
  options: IOption[];
  isRequired: boolean;
}

const SelectField = forwardRef<HTMLSelectElement, ISelect>(
  ({
    isRequired = false,
    name,
    label,
    options,
    showError,
    placeholder,
    ...rest
  }) => {
    const [field, meta, helpers] = useField({ name: name, ...rest });

    return (
      <div>
        <Select
          placeholder={placeholder}
          label={label}
          variant="bordered"
          name={name}
          isRequired={isRequired}
          isInvalid={meta.touched && meta.error && showError ? true : false}
          errorMessage={
            meta.touched && meta.error && showError ? meta.error : ""
          }
          selectedKeys={[field.value]}
          onSelectionChange={(id) => {
            helpers.setValue(id);
          }}
          {...rest}
        >
          {options.map((option) => (
            <SelectItem key={option.id} id={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    );
  },
);

SelectField.displayName = "Select";

export default SelectField;
