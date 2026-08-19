import useZoneLocation from "@/features/checkout/hook/use-zone-location"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Picker } from "@react-native-picker/picker"
import { router } from "expo-router"
import { useState } from "react"
import { appToast } from "@/lib/toast/app-toast"
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  useDeleteUserAddressMutation,
  useUserAddressQuery,
} from "../api/profile-api"

export default function AddressBookScreen() {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()
  const [deleteAddress, { isLoading: isDeletingAddress }] =
    useDeleteUserAddressMutation()

  const { data, isLoading } = useUserAddressQuery()

  const addresses = (data?.data || []).map((addr: any) => ({
    id: addr.id.toString(),
    isDefault: addr.is_default,
    label: addr.type || "Other",
    fullName: addr.full_name,
    phoneNumber: addr.phone_number,
    fullAddress: addr.full_address,
  }))
  const handleSetDefault = (id: string) => {
    // NOTE: Call API to set default address here
    console.log("Set default:", id)
  }

  const handleDeleteAddress = async (id: string) => {
    console.log("id", id)

    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteAddress({ id: id }).unwrap()
              appToast.success(res?.message || "Address deleted successfully")
            } catch (error: any) {
              console.log(error)

              appToast.error(error?.message || "Failed to delete address")
            }
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View
        style={tw.style("px-4 pb-3 border-b border-gray-100", {
          paddingTop: Math.max(insets.top + 8, 16),
          backgroundColor: colors.background,
        })}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              style={tw.style(
                "w-9 h-9 rounded-full items-center justify-center border",
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              )}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View>
              <Text
                style={tw.style("text-xl font-bold", { color: colors.text })}
              >
                Saved Addresses
              </Text>
              <Text
                style={tw.style("text-xs", { color: colors.mutedForeground })}
              >
                Manage your delivery destinations
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/profile/add-address")}
            style={tw`px-3 py-1.5 rounded-full bg-[#F0653A] flex-row items-center gap-1.5 shadow-sm`}
          >
            <Ionicons name="add-circle" size={16} color="#FFF" />
            <Text style={tw`text-xs font-bold text-white`}>Add New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── ADDRESS LIST ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw.style("p-4 gap-3.5", {
          paddingBottom: Math.max(insets.bottom + 24, 32),
        })}
      >
        {addresses.map((item) => (
          <View
            key={item.id}
            style={tw.style("p-4 rounded-2xl border gap-3 relative", {
              backgroundColor: colors.surface,
              borderColor: item.isDefault ? "#F0653A" : colors.border,
            })}
          >
            {/* Header Badge */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-2`}>
                <View
                  style={tw.style(
                    "px-2.5 py-0.5 rounded-full flex-row items-center gap-1",
                    item.label === "Home"
                      ? "bg-blue-50 text-blue-700"
                      : item.label === "Work"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                  )}
                >
                  <Ionicons
                    name={
                      item.label === "Home"
                        ? "home-outline"
                        : item.label === "Work"
                          ? "briefcase-outline"
                          : "location-outline"
                    }
                    size={13}
                    color={
                      item.label === "Home"
                        ? "#1D4ED8"
                        : item.label === "Work"
                          ? "#6B21A8"
                          : "#374151"
                    }
                  />
                  <Text style={tw`text-xs font-bold`}>{item.label}</Text>
                </View>

                {item.isDefault && (
                  <View
                    style={tw`px-2 py-0.5 rounded-full bg-red-50 border border-red-100`}
                  >
                    <Text style={tw`text-[10px] font-bold text-[#F0653A]`}>
                      DEFAULT ADDRESS
                    </Text>
                  </View>
                )}
              </View>

              <View style={tw`flex-row items-center gap-3`}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/profile/edit-address?id=${item.id}`)
                  }
                  hitSlop={6}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={colors.text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(item.id)}
                  hitSlop={6}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Address Content */}
            <View style={tw`gap-1`}>
              <Text
                style={tw.style("text-sm font-bold", { color: colors.text })}
              >
                {item.fullName} • {item.phoneNumber}
              </Text>
              <Text
                style={tw.style("text-xs leading-5", {
                  color: colors.mutedForeground,
                })}
              >
                {item.fullAddress}
              </Text>
            </View>

            {/* Set as Default Button */}
            {!item.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(item.id)}
                style={tw`pt-2 border-t border-gray-100 flex-row items-center gap-1.5 self-start`}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#F0653A"
                />
                <Text style={tw`text-xs font-bold text-[#F0653A]`}>
                  Set as Default Address
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
