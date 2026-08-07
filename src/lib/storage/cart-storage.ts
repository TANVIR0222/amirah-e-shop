import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

export interface CartItem {
  id: string | number
  name: string
  category?: string
  unit?: string
  price: number
  originalPrice?: number
  quantity: number
  image?: string
  inStock?: boolean
  variant?: string
}

const CART_STORAGE_KEY = "@amiraheshop_cart_items_v1"

// In-memory cache + Subscribers
let memoryCart: CartItem[] = []
let isInitialized = false
const listeners = new Set<(cart: CartItem[]) => void>()

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...memoryCart]))
}

// ── Helpers to format image URI ──────────────────────────────────────────────
export const getCleanImageUri = (image: any): string => {
  if (!image)
    return "https://amiraheshop.com/images/product/202607170221361.jpeg"
  if (typeof image === "string") {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image
    }
    return `https://amiraheshop.com/images/product/${image}`
  }
  if (Array.isArray(image) && image.length > 0) {
    const first = image[0]
    if (typeof first === "string") {
      return first.startsWith("http")
        ? first
        : `https://amiraheshop.com/images/product/${first}`
    }
  }
  return "https://amiraheshop.com/images/product/202607170221361.jpeg"
}

export const cartStorage = {
  // ── Initialize or get Cart ────────────────────────────────────────────────
  async getCart(): Promise<CartItem[]> {
    if (isInitialized) {
      return [...memoryCart]
    }
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        memoryCart = JSON.parse(stored)
      } else {
        memoryCart = []
      }
    } catch (err) {
      if (__DEV__) console.warn("[CartStorage] Error reading cart:", err)
      memoryCart = []
    }
    isInitialized = true
    return [...memoryCart]
  },

  // ── Add Item to Cart ──────────────────────────────────────────────────────
  async addToCart(
    item: {
      id: string | number
      name: string
      category?: string
      unit?: string
      price: number
      originalPrice?: number
      image?: any
      inStock?: boolean
      variant?: string
    },
    quantityToAdd = 1
  ): Promise<CartItem[]> {
    await this.getCart()

    const cleanId = String(item.id)
    const existingIndex = memoryCart.findIndex(
      (c) => String(c.id) === cleanId && c.variant === item.variant
    )

    const formattedImage = getCleanImageUri(item.image)

    if (existingIndex > -1) {
      memoryCart[existingIndex].quantity += quantityToAdd
    } else {
      memoryCart.unshift({
        id: cleanId,
        name: item.name,
        category: item.category || "General",
        unit: item.unit || item.variant || "1 Unit",
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice
          ? Number(item.originalPrice)
          : undefined,
        quantity: Math.max(1, quantityToAdd),
        image: formattedImage,
        inStock: item.inStock ?? true,
        variant: item.variant,
      })
    }

    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(memoryCart))
    } catch (err) {
      if (__DEV__) console.warn("[CartStorage] Error saving to cart:", err)
    }

    notifyListeners()
    return [...memoryCart]
  },

  // ── Update Item Quantity ──────────────────────────────────────────────────
  async updateQuantity(
    id: string | number,
    delta: number,
    variant?: string
  ): Promise<CartItem[]> {
    await this.getCart()

    const cleanId = String(id)
    memoryCart = memoryCart
      .map((item) => {
        if (
          String(item.id) === cleanId &&
          (!variant || item.variant === variant)
        ) {
          const newQty = item.quantity + delta
          return newQty > 0 ? { ...item, quantity: newQty } : null
        }
        return item
      })
      .filter(Boolean) as CartItem[]

    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(memoryCart))
    } catch (err) {
      if (__DEV__) console.warn("[CartStorage] Error updating quantity:", err)
    }

    notifyListeners()
    return [...memoryCart]
  },

  // ── Remove Single Item ────────────────────────────────────────────────────
  async removeFromCart(
    id: string | number,
    variant?: string
  ): Promise<CartItem[]> {
    await this.getCart()

    const cleanId = String(id)
    memoryCart = memoryCart.filter((item) => {
      if (variant) {
        return !(String(item.id) === cleanId && item.variant === variant)
      }
      return String(item.id) !== cleanId
    })

    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(memoryCart))
    } catch (err) {
      if (__DEV__) console.warn("[CartStorage] Error removing item:", err)
    }

    notifyListeners()
    return [...memoryCart]
  },

  // ── Clear All Cart Items ──────────────────────────────────────────────────
  async clearCart(): Promise<void> {
    memoryCart = []
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY)
    } catch (err) {
      if (__DEV__) console.warn("[CartStorage] Error clearing cart:", err)
    }

    notifyListeners()
  },

  // ── Subscribe to Live Changes ─────────────────────────────────────────────
  subscribe(callback: (cart: CartItem[]) => void) {
    listeners.add(callback)
    if (isInitialized) {
      callback([...memoryCart])
    } else {
      this.getCart().then(callback)
    }

    return () => {
      listeners.delete(callback)
    }
  },
}

// ── React Hook for Seamless State Sync ───────────────────────────────────────
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    cartStorage.getCart().then((initial) => {
      if (isMounted) {
        setCart(initial)
        setIsLoading(false)
      }
    })

    const unsubscribe = cartStorage.subscribe((updated) => {
      if (isMounted) {
        setCart(updated)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  )

  const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0)

  const savings = cart.reduce((acc, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return acc + (item.originalPrice - item.price) * item.quantity
    }
    return acc
  }, 0)

  return {
    cart,
    isLoading,
    subtotal,
    totalCount,
    savings,
    addToCart: cartStorage.addToCart.bind(cartStorage),
    updateQuantity: cartStorage.updateQuantity.bind(cartStorage),
    removeFromCart: cartStorage.removeFromCart.bind(cartStorage),
    clearCart: cartStorage.clearCart.bind(cartStorage),
  }
}
