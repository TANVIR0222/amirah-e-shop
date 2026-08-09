import { cartStorage } from "@/lib/storage/cart-storage"
import { useFavorites } from "@/lib/storage/favorite-storage"
import { useCallback, useMemo, useRef, useState } from "react"

const FALLBACK_IMAGE =
  "https://amiraheshop.com/images/product/202607170221361.jpeg"

export function resolveProductImage(item: any): string {
  if (!item) return FALLBACK_IMAGE

  const rawImage =
    item.image ?? item.images_array ?? item.images ?? item.category?.image

  if (typeof rawImage === "number") {
    return rawImage as any
  }

  if (Array.isArray(rawImage) && rawImage.length > 0) {
    const first = rawImage[0]
    if (typeof first === "string" && first.trim() !== "") {
      return first.startsWith("http")
        ? first
        : `https://amiraheshop.com/${first.replace(/^\//, "")}`
    }
  } else if (typeof rawImage === "string" && rawImage.trim() !== "") {
    return rawImage.startsWith("http")
      ? rawImage
      : `https://amiraheshop.com/${rawImage.replace(/^\//, "")}`
  }

  return FALLBACK_IMAGE
}

export interface UseProductActionsOptions {
  initialQty?: number
  resetAddedDuration?: number
  customImage?: string
}

export function useProductActions(
  item: any,
  options: UseProductActionsOptions = {}
) {
  const { initialQty = 1, resetAddedDuration = 1500, customImage } = options
  const { isFavorite, toggleFavorite } = useFavorites()
  const [qty, setQty] = useState(initialQty)
  const [isAdded, setIsAdded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const imageUri = useMemo(() => {
    return customImage || resolveProductImage(item)
  }, [customImage, item])

  const isLiked = item?.id ? isFavorite(item.id) : false

  const increaseQty = useCallback(() => {
    setQty((prev) => prev + 1)
  }, [])

  const decreaseQty = useCallback(() => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1))
  }, [])

  const handleToggleHeart = useCallback(
    async (e?: any) => {
      e?.stopPropagation?.()
      if (!item) return

      await toggleFavorite({
        id: item.id,
        name: item.name || item.product_name || "Product",
        category: item.category?.name || "General",
        price: Number(item.price) || Number(item.cost) || 0,
        originalPrice:
          item.wholesale_price || item.originalPrice
            ? Number(item.wholesale_price || item.originalPrice)
            : undefined,
        image: imageUri,
        rating: Number(item.ratings) || Number(item.rating) || 4.8,
        unit: item.unit || "1 Unit",
        inStock:
          item.in_stock === 1 || item.in_stock === undefined || item.inStock,
      })
    },
    [item, imageUri, toggleFavorite]
  )

  const handleQuickAdd = useCallback(
    async (e?: any, customQty?: number) => {
      e?.stopPropagation?.()
      if (!item) return

      const addQuantity = customQty ?? qty

      await cartStorage.addToCart(
        {
          id: item.id,
          name: item.name || item.product_name || "Product",
          category: item.category?.name || "General",
          price: Number(item.price) || Number(item.cost) || 0,
          originalPrice:
            item.wholesale_price || item.originalPrice
              ? Number(item.wholesale_price || item.originalPrice)
              : undefined,
          image: imageUri,
          inStock:
            item.in_stock === 1 || item.in_stock === undefined || item.inStock,
        },
        addQuantity
      )

      setIsAdded(true)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setIsAdded(false)
      }, resetAddedDuration)
    },
    [item, qty, imageUri, resetAddedDuration]
  )

  return {
    qty,
    setQty,
    increaseQty,
    decreaseQty,
    isLiked,
    isAdded,
    imageUri,
    handleToggleHeart,
    handleQuickAdd,
  }
}
