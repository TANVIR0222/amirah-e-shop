import * as Yup from "yup"

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .trim()
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .trim()
    .required("Password is required"),
})

//  Yup validation schema
export const registerValidationSchema = Yup.object().shape({
  full_name: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters")
    .required("Full name is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  checkbox: Yup.boolean().oneOf([true], "You must accept terms"),
})

export const businessInfoValidationSchema = Yup.object().shape({
  business_name: Yup.string().required("Business name is required"),
  business_phone: Yup.string()
    .matches(/^\+?\d{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  business_address: Yup.string().required("Address is required"),
})

export const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .trim()
    .required("Email is required"),
})
export const employeeLoginValidationsSchema = Yup.object().shape({
  phone_number: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Enter a valid phone number") // optional +, 10-15 digits
    .required("Phone number is required"),
})

export const createNewPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
})

export const changePasswordalidationSchema = Yup.object().shape({
  current_password: Yup.string()
    .required("Current password is required")
    .min(6, "Password must be at least 6 characters"),

  new_password: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),

  new_password_confirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("new_password")], "Passwords must match"),
})

export const UpdateProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string().email().required("Email is required"),
  dob: Yup.string()
    .required("Date of birth is required")
    .matches(
      /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
      "Date must be in yyyy-mm-dd format"
    ),
  address: Yup.string().nullable(),
})
