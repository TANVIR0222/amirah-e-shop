import { useCallback } from "react"
import { Alert } from "react-native"
import { useOrderReturnRequestMutation } from "../api/order-api"
import { appToast } from "@/lib/toast/app-toast"

export const useUserOderReturn = (id: string, reason: string) => {
  const [userOrderReturn, { isError, isLoading, data }] =
    useOrderReturnRequestMutation()

  const handleUserOrderReturn = useCallback(() => {
    Alert.alert(
      "Order Return",
      "Are you sure you want to return this order?",
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
              const data = new FormData()
              data.append("reason", reason)
              await userOrderReturn({ id, data }).unwrap()
              appToast.success("Order return request sent successfully")
            } catch (error) {
              console.log("Order return error:", error)
              appToast.error("Failed to return order")
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    )
  }, [id, userOrderReturn])

  return {
    handleUserOrderReturn,
    isError,
    isLoading,
    data,
  }
}
