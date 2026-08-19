import * as Yup from "yup"

// Validation Schema for Add Address
export const addAddressValidationSchema = Yup.object().shape({
  label: Yup.string().required("Label is required"),
  full_name: Yup.string().required("Full name is required"),
  phone_number: Yup.string()
    .matches(
      /^(013|014|015|016|017|018|019)\d{8}$/,
      "Enter a valid BD phone number (e.g. 01712345678)"
    )
    .required("Phone number is required"),
  district: Yup.string().required("District is required"),
  area: Yup.string().required("Area is required"),
  house_no: Yup.string().required("House no / Street is required"),
  full_address: Yup.string().required("Full address is required"),
})
