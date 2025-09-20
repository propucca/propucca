// @ts-nocheck
import React, { forwardRef } from "react";

import { Switch } from "@heroui/react";
import { useField } from "formik";

interface IToggle extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showError: boolean;
  name: string;
  isRequired: boolean;
  checked: boolean;
}

const Toggle = forwardRef<HTMLInputElement, IToggle>(
  ({ isRequired = false, name, showError, checked, label, ...rest }) => {
    const [meta] = useField({ name: name, ...rest });

    return (
      <div>
        <Switch
          aria-label={label}
          isRequired={isRequired}
          name={name}
          isSelected={checked}
          {...rest}
        >
          {label}
        </Switch>
        {meta.touched && meta.error && showError && (
          <div className="text-danger">{meta.error}</div>
        )}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
