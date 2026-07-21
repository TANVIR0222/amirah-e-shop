import { Dimensions } from "react-native"

const { height, width } = Dimensions.get("window")

export const _WIDTH = width
export const _HEIGHT = height

export const IMAGE_WIDTH = width - 33
export const IMAGE_HEIGHT = IMAGE_WIDTH - 50
