import Skeleton from "@/components/ui/skeleton"
import tw from "@/lib/tailwind"
import { IMAGE_HEIGHT, IMAGE_WIDTH } from "@/utils/phone-screen-size"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { useCallback, useRef, useState } from "react"
import {
  Dimensions,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"
import PagerView from "react-native-pager-view"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const AnimatedImage = Animated.createAnimatedComponent(Image)

function ZoomableImageItem({
  uri,
  onZoomStateChange,
}: {
  uri: string
  onZoomStateChange: (isZoomed: boolean) => void
}) {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translationX = useSharedValue(0)
  const translationY = useSharedValue(0)
  const savedTranslationX = useSharedValue(0)
  const savedTranslationY = useSharedValue(0)

  const updateZoomState = useCallback(
    (zoomed: boolean) => {
      onZoomStateChange(zoomed)
    },
    [onZoomStateChange]
  )

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(1, Math.min(savedScale.value * event.scale, 4))
      if (scale.value > 1.05) {
        runOnJS(updateZoomState)(true)
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value
      if (scale.value <= 1.05) {
        scale.value = withTiming(1)
        savedScale.value = 1
        translationX.value = withTiming(0)
        translationY.value = withTiming(0)
        savedTranslationX.value = 0
        savedTranslationY.value = 0
        runOnJS(updateZoomState)(false)
      }
    })

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .onUpdate((event) => {
      if (scale.value > 1.05) {
        translationX.value = savedTranslationX.value + event.translationX
        translationY.value = savedTranslationY.value + event.translationY
      }
    })
    .onEnd(() => {
      savedTranslationX.value = translationX.value
      savedTranslationY.value = translationY.value
    })

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1.2) {
        scale.value = withTiming(1)
        savedScale.value = 1
        translationX.value = withTiming(0)
        translationY.value = withTiming(0)
        savedTranslationX.value = 0
        savedTranslationY.value = 0
        runOnJS(updateZoomState)(false)
      } else {
        scale.value = withSpring(2.5)
        savedScale.value = 2.5
        runOnJS(updateZoomState)(true)
      }
    })

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AnimatedImage
          source={{ uri }}
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.75,
            },
            animatedStyle,
          ]}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>
    </GestureDetector>
  )
}

const ProductImageSlider = ({ images }: { images: string[] | undefined }) => {
  const insets = useSafeAreaInsets()
  const pagerRef = useRef<PagerView>(null)
  const modalPagerRef = useRef<PagerView>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<number[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => [...prev, index])
  }, [])

  const imageUrls = (images ?? [])
    .filter((img) => typeof img === "string" && img.trim() !== "")
    .map((img) => ({ uri: img }))

  const scrollToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= imageUrls.length) return
      pagerRef.current?.setPage(index)
      setCurrentIndex(index)
    },
    [imageUrls.length]
  )

  const openImageModal = useCallback((index: number) => {
    setModalIndex(index)
    setIsModalVisible(true)
  }, [])

  const closeImageModal = useCallback(() => {
    setIsModalVisible(false)
    setIsZoomed(false)
  }, [])

  if (!imageUrls.length) return null

  return (
    <View style={tw`relative mt-6`}>
      {/* ── Main Slider ── */}
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

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => openImageModal(index)}
              style={tw`w-full h-full`}
            >
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
            </TouchableOpacity>
          </View>
        ))}
      </PagerView>

      {/* ── Arrow Buttons for Main Slider ── */}
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

      {/* ── Fullscreen Animated Pinch-Zoom Image Modal ── */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
        statusBarTranslucent
      >
        <GestureHandlerRootView style={tw`flex-1 bg-black relative`}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />

          {/* ── Top Header Bar ── */}
          <View
            style={tw.style(
              `absolute left-0 right-0 z-50 flex-row items-center justify-between px-4 py-3 bg-black/60`,
              {
                top: Math.max(insets.top, 20),
              }
            )}
          >
            {/* Image Counter */}
            <View style={tw`bg-white/20 px-3 py-1.5 rounded-full`}>
              <Text style={tw`text-white text-xs font-semibold`}>
                {modalIndex + 1} / {imageUrls.length}
              </Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={closeImageModal}
              style={tw`w-9 h-9 rounded-full bg-white/20 items-center justify-center`}
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ── Fullscreen Pager View with Pinch Zoom ── */}
          <PagerView
            ref={modalPagerRef}
            initialPage={modalIndex}
            scrollEnabled={!isZoomed}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            onPageSelected={(e) => {
              const newPos = e.nativeEvent.position
              setModalIndex(newPos)
              scrollToIndex(newPos)
              setIsZoomed(false)
            }}
          >
            {imageUrls.map((img, index) => (
              <View
                key={index}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              >
                <ZoomableImageItem
                  uri={img.uri}
                  onZoomStateChange={(zoomed) => setIsZoomed(zoomed)}
                />
              </View>
            ))}
          </PagerView>

          {/* Bottom Hint */}
          <View
            style={tw.style(
              `absolute bottom-6 z-50 bg-black/60 px-4 py-2 rounded-full align-self-center`,
              {
                bottom: Math.max(insets.bottom + 10, 24),
                left: SCREEN_WIDTH / 2 - 120,
              }
            )}
          >
            <Text style={tw`text-gray-300 text-xs text-center`}>
              Pinch with two fingers or double tap to zoom
            </Text>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  )
}

export default ProductImageSlider
