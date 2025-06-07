// yapSchema/registerSchema.js
import * as yup from "yup";

export const registerSchema = yup.object({
  school_name: yup
    .string()
    .min(3, "School name must contain at least 3 characters.")
    .required("School name is required."),

  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits.")
    .required("Phone number is required."),

  admin_name: yup.string().required("Admin name is required."),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),

  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Please confirm your password."),
});