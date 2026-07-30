import tw from "@/lib/tailwind"
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "@/utils/phone-screen-size"
import { MaterialIcons } from "@expo/vector-icons"
import React, { useRef } from "react"
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native"

let PagerView: any = null
if (Platform.OS !== "web") {
  try {
    // Dynamically require PagerView on mobile platforms to prevent Web Metro bundling errors
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    PagerView = require("react-native-pager-view").default
  } catch {
    PagerView = null
  }
}

const ProductImageSlider = ({ images }: { images: string[] | undefined }) => {
  const pagerRef = useRef<any>(null)
  const scrollViewRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const imageUrls = (images || []).map((img) => ({
    // @ts-ignore
    uri: typeof img === "string" ? img : img || "",
  }))

  if (!imageUrls.length) return null

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < imageUrls.length) {
      if (Platform.OS !== "web" && PagerView && pagerRef.current) {
        pagerRef.current.setPage(index)
      } else if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: index * IMAGE_WIDTH,
          animated: true,
        })
      }
      setCurrentIndex(index)
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const newIndex = Math.round(contentOffsetX / IMAGE_WIDTH)
    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < imageUrls.length
    ) {
      setCurrentIndex(newIndex)
    }
  }

  return (
    <View style={tw`relative mt-3`}>
      {Platform.OS !== "web" && PagerView ? (
        <PagerView
          ref={pagerRef}
          initialPage={0}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            alignSelf: "center",
          }}
          onPageSelected={(e: any) => setCurrentIndex(e.nativeEvent.position)}
        >
          {imageUrls.map((img, index) => (
            <View
              key={index}
              style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
            >
              <Image
                source={{ uri: img.uri }}
                style={{
                  width: IMAGE_WIDTH,
                  height: IMAGE_HEIGHT,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            </View>
          ))}
        </PagerView>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            alignSelf: "center",
          }}
        >
          {imageUrls.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.uri }}
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {imageUrls.length > 1 && (
        <>
          <TouchableOpacity
            onPress={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            style={[
              tw`absolute left-2 top-1/2 bg-[#E2E2E2] p-1 rounded-full z-10`,
              { marginTop: -18, opacity: currentIndex === 0 ? 0.5 : 1 },
            ]}
          >
            <MaterialIcons name="keyboard-arrow-left" size={26} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex === imageUrls.length - 1}
            style={[
              tw`absolute right-2 top-1/2 bg-[#E2E2E2] p-1 rounded-full z-10`,
              {
                marginTop: -18,
                opacity: currentIndex === imageUrls.length - 1 ? 0.5 : 1,
              },
            ]}
          >
            <MaterialIcons
              name="keyboard-arrow-right"
              size={26}
              color="black"
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export default ProductImageSlider
