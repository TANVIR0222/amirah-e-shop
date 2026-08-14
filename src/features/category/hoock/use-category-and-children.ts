import { useMemo } from "react"
import { useGetCategoryQuery } from "../api/category-api"
import { CategoryResponse } from "@/features/home/types/home-api-type"

export interface CategoryWithChildren extends CategoryResponse {
  children?: CategoryResponse[]
}

const useCategoryAndChildren = () => {
  const {
    data: page1Data,
    isLoading,
    refetch,
  } = useGetCategoryQuery({
    page: 1,
    per_page: 1000,
  })

  const rawCategories = useMemo(() => page1Data?.data?.data ?? [], [page1Data])

  const categoryData = useMemo<CategoryWithChildren[]>(() => {
    if (!rawCategories.length) return []

    // If API items already have children populated
    const hasEmbeddedChildren = rawCategories.some(
      (cat: any) => Array.isArray(cat.children) && cat.children.length > 0
    )
    if (hasEmbeddedChildren) {
      return rawCategories as CategoryWithChildren[]
    }

    // Top-level categories (parent_id is null or 0)
    const parents = rawCategories.filter(
      (cat) => !cat.parent_id || Number(cat.parent_id) === 0
    )

    // Match child categories with their respective parent
    return parents.map((parent) => ({
      ...parent,
      children: rawCategories.filter(
        (child) => Number(child.parent_id) === parent.id
      ),
    }))
  }, [rawCategories])

  return {
    categoryData,
    rawCategories,
    isLoading,
    refetch,
  }
}

export default useCategoryAndChildren
