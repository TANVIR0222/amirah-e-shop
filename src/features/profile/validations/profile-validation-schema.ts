import * as Yup from "yup"

const editProfileValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Full name is required"),
  phone: Yup.string().trim().required("Phone number is required"),
})

export default editProfileValidationSchema
