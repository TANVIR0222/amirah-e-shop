import { create } from "twrnc"

// create the customized version...
const tw = create(require(`../../tailwind.config.js`)) // <- points to root tailwind config

// ... and then this becomes the main function your app uses
export default tw
