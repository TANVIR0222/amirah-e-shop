import { useMyOrderQuery } from "../api/checkout-api"

const useOrder = () => {
  const { data, isLoading } = useMyOrderQuery()

  const orderLenght = data?.data?.orders?.length

  return { orderLenght, data, isLoading }
}

export default useOrder
