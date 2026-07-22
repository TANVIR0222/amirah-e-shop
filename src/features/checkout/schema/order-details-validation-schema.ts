import * as Yup from "yup"

export const orderDetailsValidationSchema = Yup.object().shape({
  full_name: Yup.string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters")
    .required("Full name is required"),

  phone_number: Yup.string()
    .trim()
    .matches(
      /^(?:\+88)?01[3-9]\d{8}$/,
      "Enter a valid 11-digit phone number (e.g. 01712345678)"
    )
    .required("Phone number is required"),

  district: Yup.string().required("Please select your District / City"),

  area: Yup.string().required("Please select your Area"),

  house_no: Yup.string()
    .trim()
    .min(2, "Building / House No must be at least 2 characters")
    .required("Building / House No / Floor / Street is required"),

  locality: Yup.string()
    .trim()
    .min(2, "Locality / Landmark must be at least 2 characters")
    .required("Colony / Suburb / Locality / Landmark is required"),

  full_address: Yup.string()
    .trim()
    .min(5, "Full address must be at least 5 characters")
    .required("Full address is required"),

  delivery_type: Yup.string().required("Please select delivery type"),

  payment_method: Yup.string().required("Please select a payment method"),

  note: Yup.string().trim().optional(),
})
