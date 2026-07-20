import tw from "@/lib/tailwind"
import { _WIDTH } from "@/utils/phone-screen-size"
import { homeCarousel } from "@/utils/ui-data"
import * as React from "react"
import { Image, View } from "react-native"
import {
  Extrapolation,
  interpolate,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated"
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel"

const HomeCarousel = () => {
  const ref = React.useRef<ICarouselInstance>(null)

  const progress = useSharedValue(0)
  const currentIndex = React.useRef(0)

  const onPressPagination = React.useCallback((index: number) => {
    const diff = index - currentIndex.current

    ref.current?.scrollTo({
      count: diff,
      animated: true,
    })
  }, [])

  return (
    <View style={tw`items-center `}>
      <Carousel
        ref={ref}
        loop
        width={_WIDTH * 0.91}
        height={165}
        data={homeCarousel || []}
        autoPlay
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
        pagingEnabled
        snapEnabled
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress

          runOnJS(() => {
            currentIndex.current =
              Math.round(absoluteProgress) % homeCarousel.length
          })()
        }}
        renderItem={({ item }) => (
          <View style={tw`flex-1 justify-center flex-row p-1`}>
            <Image
              source={{
                uri: "https://img.magnific.com/free-vector/gradient-shopping-discount-horizontal-sale-banner_23-2150321996.jpg?t=st=1784568760~exp=1784572360~hmac=6b6585b9dbd3c120d4b802b8150ced1557b3c22d9981974accd0bffa5ba9df8d&w=2000",
              }}
              style={tw`w-full h-full rounded-xl`}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Pagination */}
      <Pagination.Custom
        progress={progress}
        data={homeCarousel}
        size={10}
        horizontal
        onPress={onPressPagination}
        containerStyle={{
          gap: 6,
          marginTop: 12,
          alignItems: "center",
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 100,
          backgroundColor: "#7561EA",
        }}
        activeDotStyle={{
          width: 28,
          height: 10,
          borderRadius: 100,
          backgroundColor: "#7561EA",
        }}
        customReanimatedStyle={(value, index, length) => {
          let inputRange = [index - 1, index, index + 1]

          if (index === 0 && value > length - 1) {
            inputRange = [length - 1, length, length + 1]
          }

          const width = interpolate(
            value,
            inputRange,
            [10, 28, 10],
            Extrapolation.CLAMP
          )

          const opacity = interpolate(
            value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
          )

          return {
            width,
            opacity,
          }
        }}
      />
    </View>
  )
}

export default HomeCarousel
