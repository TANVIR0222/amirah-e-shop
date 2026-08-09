import { useUserProfileQuery } from "@/features/profile/api/profile-api"

export default function useAuthUserInfo() {
  const { data, isLoading } = useUserProfileQuery()

  return {
    name: data?.data?.name,
    phone: data?.data?.phone,
    image: data?.data?.image,
    isLoading,
  }
}
