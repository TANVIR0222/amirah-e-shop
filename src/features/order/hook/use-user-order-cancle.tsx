import { useCallback } from "react"
import { Alert } from "react-native"
import { useUserOrderCancheMutation } from "../api/order-api"
import { appToast } from "@/lib/toast/app-toast"

export const useUserOderCancle = (id: string) => {
  const [userOrderCanche, { isError, isLoading, data }] =
    useUserOrderCancheMutation()

  const handleUserOrderCanche = useCallback(() => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            try {
              await userOrderCanche(id).unwrap()

              appToast.success("Order cancelled successfully")
            } catch (error) {
              console.log("Cancel order error:", error)
              appToast.error("Failed to cancel order")
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    )
  }, [id, userOrderCanche])

  return {
    handleUserOrderCanche,
    isError,
    isLoading,
    data,
  }
}
