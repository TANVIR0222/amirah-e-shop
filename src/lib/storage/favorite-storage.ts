import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { getCleanImageUri } from "./cart-storage"

export interface FavoriteItem {
  id: string | number
  name: string
  category?: string
  price: number
  originalPrice?: number
  image?: string
  rating?: number
  unit?: string
  inStock?: boolean
}

const FAVORITES_STORAGE_KEY = "@amiraheshop_favorite_items_v1"

// In-memory cache + Subscribers
let memoryFavorites: FavoriteItem[] = []
let isInitialized = false
const listeners = new Set<(favorites: FavoriteItem[]) => void>()

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...memoryFavorites]))
}

export const favoriteStorage = {
  // ── Get all favorites ──────────────────────────────────────────────────────
  async getFavorites(): Promise<FavoriteItem[]> {
    if (isInitialized) {
      return [...memoryFavorites]
    }
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        memoryFavorites = JSON.parse(stored)
      } else {
        memoryFavorites = []
      }
    } catch (err) {
      if (__DEV__)
        console.warn("[FavoriteStorage] Error reading favorites:", err)
      memoryFavorites = []
    }
    isInitialized = true
    return [...memoryFavorites]
  },

  // ── Check if item is favorited ─────────────────────────────────────────────
  isFavorite(id: string | number): boolean {
    const cleanId = String(id)
    return memoryFavorites.some((item) => String(item.id) === cleanId)
  },

  // ── Toggle Favorite (Add if absent, Remove if present) ─────────────────────
  async toggleFavorite(item: {
    id: string | number
    name: string
    category?: string
    price?: number
    originalPrice?: number
    image?: any
    rating?: number
    unit?: string
    inStock?: boolean
  }): Promise<boolean> {
    await this.getFavorites()

    const cleanId = String(item.id)
    const existingIndex = memoryFavorites.findIndex(
      (f) => String(f.id) === cleanId
    )

    let isNowFavorited = false

    if (existingIndex > -1) {
      // Remove from favorites
      memoryFavorites.splice(existingIndex, 1)
      isNowFavorited = false
    } else {
      // Add to favorites
      const formattedImage = getCleanImageUri(item.image)
      memoryFavorites.unshift({
        id: cleanId,
        name: item.name,
        category: item.category || "General",
        price: Number(item.price) || 0,
        originalPrice: item.originalPrice
          ? Number(item.originalPrice)
          : undefined,
        image: formattedImage,
        rating: item.rating ?? 4.8,
        unit: item.unit || "1 Unit",
        inStock: item.inStock ?? true,
      })
      isNowFavorited = true
    }

    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(memoryFavorites)
      )
    } catch (err) {
      if (__DEV__)
        console.warn("[FavoriteStorage] Error saving favorites:", err)
    }

    notifyListeners()
    return isNowFavorited
  },

  // ── Remove Single Favorite ─────────────────────────────────────────────────
  async removeFavorite(id: string | number): Promise<FavoriteItem[]> {
    await this.getFavorites()

    const cleanId = String(id)
    memoryFavorites = memoryFavorites.filter(
      (item) => String(item.id) !== cleanId
    )

    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(memoryFavorites)
      )
    } catch (err) {
      if (__DEV__)
        console.warn("[FavoriteStorage] Error removing favorite:", err)
    }

    notifyListeners()
    return [...memoryFavorites]
  },

  // ── Clear All Favorites ────────────────────────────────────────────────────
  async clearFavorites(): Promise<void> {
    memoryFavorites = []
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY)
    } catch (err) {
      if (__DEV__)
        console.warn("[FavoriteStorage] Error clearing favorites:", err)
    }

    notifyListeners()
  },

  // ── Subscribe to Live Updates ──────────────────────────────────────────────
  subscribe(callback: (favorites: FavoriteItem[]) => void) {
    listeners.add(callback)
    if (isInitialized) {
      callback([...memoryFavorites])
    } else {
      this.getFavorites().then(callback)
    }

    return () => {
      listeners.delete(callback)
    }
  },
}

// ── React Hook for Reactive Favorite Sync ────────────────────────────────────
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    favoriteStorage.getFavorites().then((initial) => {
      if (isMounted) {
        setFavorites(initial)
        setIsLoading(false)
      }
    })

    const unsubscribe = favoriteStorage.subscribe((updated) => {
      if (isMounted) {
        setFavorites(updated)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const isFavorite = (id: string | number) => {
    const cleanId = String(id)
    return favorites.some((f) => String(f.id) === cleanId)
  }

  return {
    favorites,
    isLoading,
    totalCount: favorites.length,
    isFavorite,
    toggleFavorite: favoriteStorage.toggleFavorite.bind(favoriteStorage),
    removeFavorite: favoriteStorage.removeFavorite.bind(favoriteStorage),
    clearFavorites: favoriteStorage.clearFavorites.bind(favoriteStorage),
  }
}
