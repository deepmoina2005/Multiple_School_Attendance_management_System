// yupSchema/studentsSchema.js
import * as yup from "yup";

export const studentsSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),

  name: yup
    .string()
    .min(2, "Name must be at least 2 characters.")
    .required("Student name is required."),

  student_class: yup
    .string()
    .required("Student class is required."),

  age: yup
    .number()
    .typeError("Age must be a number.")
    .positive("Age must be positive.")
    .integer("Age must be an integer.")
    .required("Age is required."),

  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Gender must be Male, Female, or Other.")
    .required("Gender is required."),

  gurdian: yup
    .string()
    .min(2, "Guardian name must be at least 2 characters.")
    .required("Guardian name is required."),

  gurdian_phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Guardian phone must be 10 digits.")
    .required("Guardian phone number is required."),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),

  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Please confirm your password."),
});