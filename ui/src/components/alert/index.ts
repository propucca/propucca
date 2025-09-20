import { addToast } from "@heroui/react";

export const successMessage = (message: string, description?: string): void => {
  addToast({
    title: message,
    description: description,
    color: "primary",
    variant: "flat",
  });
};

export const warningMessage = (message: string, description?: string): void => {
  addToast({
    title: message,
    description: description,
    color: "warning",
    variant: "flat",
  });
};

export const errorMessage = (message: string, description?: string): void => {
  addToast({
    title: message,
    description: description,
    color: "danger",
    variant: "flat",
  });
};
