import Skeleton from "@/components/ui/skeleton"
import tw from "@/lib/tailwind"
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "@/utils/phone-screen-size"
import { MaterialIcons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import PagerView from "react-native-pager-view"

const ProductImageSlider = ({ images }: { images: string[] | undefined }) => {
  const pagerRef = useRef<PagerView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [loadedImages, setLoadedImages] = useState<number[]>([])

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => [...prev, index])
  }

  const imageUrls = (images ?? [])
    .filter((img) => typeof img === "string" && img.trim() !== "")
    .map((img) => ({ uri: img }))

  if (!imageUrls.length) return null

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= imageUrls.length) return

    pagerRef.current?.setPage(index)
    setCurrentIndex(index)
  }

  return (
    <View style={tw`relative mt-3`}>
      <PagerView
        ref={pagerRef}
        initialPage={0}
        style={{
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
          alignSelf: "center",
        }}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
      >
        {imageUrls.map((img, index) => (
          <View
            key={index}
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
            }}
          >
            {!loadedImages.includes(index) && (
              <Skeleton
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                style={{
                  borderRadius: 8,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}

            <Image
              source={{ uri: img.uri }}
              style={{
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                borderRadius: 8,
                opacity: loadedImages.includes(index) ? 1 : 0,
              }}
              contentFit="cover"
              onLoad={() => handleImageLoad(index)}
            />
          </View>
        ))}
      </PagerView>

      {imageUrls?.length > 1 && (
        <>
          <TouchableOpacity
            onPress={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            style={[
              tw`absolute left-2 top-1/2 bg-[#E2E2E2] p-1 rounded-full z-10`,
              {
                marginTop: -18,
                opacity: currentIndex === 0 ? 0.5 : 1,
              },
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
