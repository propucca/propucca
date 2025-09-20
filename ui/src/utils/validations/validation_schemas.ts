import * as yup from "yup";

const formatErrString = (
  field: string,
  type: "min" | "max",
  len: number,
): string => {
  if (type === "min") {
    return `${field} should be more than ${len} characters.`;
  } else if (type === "max") {
    return `${field} should be less than ${len} characters.`;
  } else {
    return `${field} is invalid.`;
  }
};

export const loginValidationSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Invalid email."),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])(?=.{8,15})/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be between 8 and 15 characters long.",
    ),
});

export const forgetPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Invalid email."),
});

export const changePasswordValidationSchema = yup.object().shape({
  new_password: yup
    .string()
    .required("New Password is required")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/,
      "Password must contain atleast one small letter, one capital letter, one special character with minimum 8 length and maximum 15",
    ),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("new_password")], "New password not matching!."),
});

export const adminValidationSchema = yup.object().shape({
  user_name: yup
    .string()
    .trim()
    .required("Admin name is required.")
    .max(50, formatErrString("Admin name", "max", 50))
    .min(3, formatErrString("Admin name", "min", 3)),
  email: yup
    .string()
    .trim()
    .required("Email is required.")
    .email("Invalid email.")
    .max(50, formatErrString("Admin name", "max", 50)),
  user_type: yup.string().trim().required("User type is required."),
  role_id: yup.number().required("Role is required."),
});
