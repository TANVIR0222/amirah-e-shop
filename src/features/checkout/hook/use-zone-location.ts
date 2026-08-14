import { useGetZoneQuery } from "../api/checkout-api"

const useZoneLocation = () => {
  const { data, isLoading, refetch } = useGetZoneQuery()
  return {
    data: data?.data ?? [],
    isLoading,
    refetch,
  }
}

export default useZoneLocation
