import { areas, districts } from "@/features/checkout/screen/order-details"
import tw from "@/lib/tailwind"
import { useAppTheme } from "@/theme/theme-provider"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Picker } from "@react-native-picker/picker"
import { router } from "expo-router"
import { useState } from "react"
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type AddressItem = {
  id: string
  fullName: string
  phoneNumber: string
  district: string
  area: string
  houseNo: string
  locality: string
  fullAddress: string
  label: "Home" | "Work" | "Other"
  isDefault: boolean
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "ADDR-101",
    fullName: "Tanvir Islam",
    phoneNumber: "01712345678",
    district: "Dhaka",
    area: "Banani",
    houseNo: "House #45, Flat #4B, Road #11",
    locality: "Near Banani Super Market",
    fullAddress: "House #45, Flat #4B, Road #11, Block-D, Banani, Dhaka",
    label: "Home",
    isDefault: true,
  },
  {
    id: "ADDR-102",
    fullName: "Tanvir Islam (Office)",
    phoneNumber: "01887654321",
    district: "Dhaka",
    area: "Gulshan",
    houseNo: "Level 4, Plot 12",
    locality: "Gulshan Avenue",
    fullAddress: "Level 4, Plot 12, Gulshan Avenue, Dhaka",
    label: "Work",
    isDefault: false,
  },
]

export default function AddressBookScreen() {
  const { colors } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [district, setDistrict] = useState("Dhaka")
  const [area, setArea] = useState("Mirpur")
  const [houseNo, setHouseNo] = useState("")
  const [locality, setLocality] = useState("")
  const [fullAddressText, setFullAddressText] = useState("")
  const [label, setLabel] = useState<"Home" | "Work" | "Other">("Home")

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    )
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSaveAddress = () => {
    if (!fullName.trim() || !phone.trim() || !fullAddressText.trim()) return

    const newAddr: AddressItem = {
      id: `ADDR-${Date.now()}`,
      fullName,
      phoneNumber: phone,
      district,
      area,
      houseNo: houseNo || fullAddressText,
      locality: locality || area,
      fullAddress: fullAddressText,
      label,
      isDefault: addresses.length === 0,
    }

    setAddresses((prev) => [...prev, newAddr])
    setIsModalOpen(false)

    // Reset Form
    setFullName("")
    setPhone("")
    setHouseNo("")
    setLocality("")
    setFullAddressText("")
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
            onPress={() => setIsModalOpen(true)}
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

              <TouchableOpacity
                onPress={() => handleDeleteAddress(item.id)}
                hitSlop={6}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
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

      {/* ── ADD NEW ADDRESS MODAL ── */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.container}>
          {/* Modal Header */}
          <View
            style={tw.style(
              "px-4 pb-3 border-b border-gray-100 flex-row items-center justify-between",
              {
                paddingTop: Math.max(insets.top + 8, 16),
                backgroundColor: colors.background,
              }
            )}
          >
            <Text style={tw.style("text-lg font-bold", { color: colors.text })}>
              Add New Address
            </Text>
            <TouchableOpacity onPress={() => setIsModalOpen(false)} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Form Scroll View */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw.style("p-4 gap-4", {
              paddingBottom: Math.max(insets.bottom + 24, 32),
            })}
          >
            {/* Label Chips */}
            <View style={tw`gap-2`}>
              <Text
                style={tw.style("text-xs font-bold", { color: colors.text })}
              >
                Save Address As
              </Text>
              <View style={tw`flex-row gap-2`}>
                {(["Home", "Work", "Other"] as const).map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setLabel(tag)}
                    style={tw.style(
                      "px-4 py-2 rounded-xl border flex-row items-center gap-1.5",
                      label === tag
                        ? { backgroundColor: "#FEF2F2", borderColor: "#F0653A" }
                        : {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          }
                    )}
                  >
                    <Text
                      style={tw.style("text-xs font-bold", {
                        color: label === tag ? "#F0653A" : colors.text,
                      })}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Inputs */}
            <View style={tw`gap-1`}>
              <Text
                style={tw.style("text-xs font-bold mb-1", {
                  color: colors.text,
                })}
              >
                Full Name *
              </Text>
              <TextInput
                style={tw.style("border rounded-xl px-3.5 h-11 text-xs", {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                })}
                placeholder="Enter full name"
                placeholderTextColor={colors.mutedForeground}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={tw`gap-1`}>
              <Text
                style={tw.style("text-xs font-bold mb-1", {
                  color: colors.text,
                })}
              >
                Phone Number *
              </Text>
              <TextInput
                style={tw.style("border rounded-xl px-3.5 h-11 text-xs", {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                })}
                placeholder="01XXXXXXXXX"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* District & Area Pickers */}
            <View style={tw`flex-row gap-3`}>
              <View style={tw`flex-1 gap-1`}>
                <Text
                  style={tw.style("text-xs font-bold mb-1", {
                    color: colors.text,
                  })}
                >
                  District *
                </Text>
                <View
                  style={tw.style(
                    "border rounded-xl bg-white overflow-hidden",
                    { borderColor: colors.border }
                  )}
                >
                  <Picker
                    selectedValue={district}
                    onValueChange={(val) => {
                      setDistrict(val)
                      setArea(areas[val]?.[0] || "")
                    }}
                  >
                    {districts.map((d) => (
                      <Picker.Item key={d} label={d} value={d} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={tw`flex-1 gap-1`}>
                <Text
                  style={tw.style("text-xs font-bold mb-1", {
                    color: colors.text,
                  })}
                >
                  Area *
                </Text>
                <View
                  style={tw.style(
                    "border rounded-xl bg-white overflow-hidden",
                    { borderColor: colors.border }
                  )}
                >
                  <Picker
                    selectedValue={area}
                    onValueChange={(val) => setArea(val)}
                  >
                    {(areas[district] || []).map((a) => (
                      <Picker.Item key={a} label={a} value={a} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={tw`gap-1`}>
              <Text
                style={tw.style("text-xs font-bold mb-1", {
                  color: colors.text,
                })}
              >
                Building / House No / Street *
              </Text>
              <TextInput
                style={tw.style("border rounded-xl px-3.5 h-11 text-xs", {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                })}
                placeholder="e.g. House #45, Flat #4B, Road #11"
                placeholderTextColor={colors.mutedForeground}
                value={houseNo}
                onChangeText={setHouseNo}
              />
            </View>

            <View style={tw`gap-1`}>
              <Text
                style={tw.style("text-xs font-bold mb-1", {
                  color: colors.text,
                })}
              >
                Full Address Details *
              </Text>
              <TextInput
                style={tw.style("border rounded-xl p-3.5 h-20 text-xs", {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text,
                })}
                placeholder="e.g. House #45, Flat #4B, Road #11, Block-D, Banani, Dhaka"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                value={fullAddressText}
                onChangeText={setFullAddressText}
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveAddress}
              style={tw`mt-4 h-12 rounded-2xl bg-[#F0653A] items-center justify-center shadow-sm`}
            >
              <Text style={tw`text-sm font-bold text-white`}>Save Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
})
