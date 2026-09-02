import { useCart } from "@/lib/storage/cart-storage"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, usePathname } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  Animated,
  Dimensions,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const BUTTON_SIZE = 56
const BRAND_COLOR = "#F0653A"
const MARGIN = 16

export function DraggableFloatingCart() {
  const { totalCount } = useCart()
  const insets = useSafeAreaInsets()
  const pathname = usePathname()

  const minX = MARGIN
  const maxX = SCREEN_WIDTH - BUTTON_SIZE - MARGIN
  const minY = Math.max(insets.top + 50, 60)
  const maxY = SCREEN_HEIGHT - Math.max(insets.bottom + 80, 100)

  // Animated values initialized in state (once per component lifecycle)
  const [pan] = useState(
    () => new Animated.ValueXY({ x: maxX, y: SCREEN_HEIGHT - 220 })
  )
  const [scaleAnim] = useState(() => new Animated.Value(1))

  // PanResponder initialized in state (clean, no refs read during render)
  const [panResponder] = useState<PanResponderInstance>(() => {
    let currentX = maxX
    let currentY = SCREEN_HEIGHT - 220
    let dragging = false

    pan.addListener((value) => {
      currentX = value.x
      currentY = value.y
    })

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4
      },
      onPanResponderGrant: () => {
        dragging = false
        pan.setOffset({ x: currentX, y: currentY })
        pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4) {
          dragging = true
        }
        pan.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: () => {
        pan.flattenOffset()

        if (!dragging) {
          router.push("/cart")
          return
        }

        const clampedY = Math.min(Math.max(currentY, minY), maxY)
        const middleX = SCREEN_WIDTH / 2
        const targetX = currentX < middleX ? minX : maxX

        Animated.spring(pan, {
          toValue: { x: targetX, y: clampedY },
          friction: 6,
          tension: 40,
          useNativeDriver: false,
        }).start(() => {
          dragging = false
        })
      },
    })
  })

  // Pulse animation on cart count increase
  useEffect(() => {
    if (totalCount > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: false,
        }),
      ]).start()
    }
  }, [totalCount, scaleAnim])

  // Hide on cart screen or auth screen
  const isCartScreen =
    pathname === "/cart" ||
    pathname === "/(common)/cart" ||
    pathname.includes("checkout") ||
    pathname.includes("(auth)")

  if (isCartScreen) {
    return null
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/cart")}
        style={styles.button}
      >
        <View style={styles.glowRing} />
        <Ionicons name="bag-handle" size={26} color="#FFFFFF" />

        {totalCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalCount > 99 ? "99+" : totalCount}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 9999,
    elevation: 12,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: BRAND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  glowRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFD700",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeText: {
    color: "#1F2937",
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },
})
