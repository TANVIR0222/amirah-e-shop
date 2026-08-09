import React from "react"
import { ViewStyle } from "react-native"
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import tw from "twrnc"

interface SkeletonProps {
  width?: number | string
  height?: number
  style?: ViewStyle | ViewStyle[]
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 16,
  style,
}) => {
  const opacity = useSharedValue(0.3)

  React.useEffect(() => {
    // Start animation once
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true)

    return () => {
      // Cleanup when unmounted
      cancelAnimation(opacity)
    }
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        animatedStyle,
        { width, height },
        tw`bg-gray-200 rounded-md`,
        style,
      ]}
    />
  )
}

export default Skeleton
