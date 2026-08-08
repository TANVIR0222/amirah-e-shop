import tw from "@/lib/tailwind"
import Feather from "@expo/vector-icons/Feather"
import React from "react"
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native"
interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  onBlur?: () => void
  error?: string
  touched?: boolean
  keyboardType?: TextInputProps["keyboardType"]
  labelStyle?: object
  textInputStyle?: object
  containerStyle?: object
  outerContainerStyle?: object
  isPassword?: boolean
  multiline?: boolean
  numberOfLines?: number
  autoCapitalize?: TextInputProps["autoCapitalize"]
}

const MainInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  keyboardType = "default",
  labelStyle,
  textInputStyle,
  containerStyle,
  outerContainerStyle,
  isPassword = false,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = "none",
}) => {
  const [secureText, setSecureText] = React.useState(isPassword)

  const showError = touched && !!error

  return (
    <View style={tw.style(`mb-4`, outerContainerStyle)}>
      {/* Label */}
      {Boolean(label) && (
        <Text
          style={tw.style(
            `text-text_gray font-geist-medium text-sm mb-2`,
            labelStyle
          )}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={tw.style(
          `flex-row items-center border rounded-full px-4 bg-white`,
          multiline ? "min-h-28 rounded-3xl items-start pt-1" : "h-12",
          showError ? "border-red" : "border-[#A2A2A2]",
          containerStyle
        )}
      >
        {/* Input */}
        <TextInput
          style={tw.style(
            `flex-1 text-base text-title font-geist-regular`,
            multiline && "text-top",
            textInputStyle
          )}
          placeholder={placeholder}
          // placeholderTextColor="#A2A2A2"
          keyboardType={keyboardType}
          secureTextEntry={isPassword && secureText}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          autoCapitalize={autoCapitalize}
        />

        {/* Password Toggle */}
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={tw`ml-2 pt-1`}
          >
            <Feather
              name={secureText ? "eye" : "eye-off"}
              size={24}
              color="#A2A2A2"
            />
            {/* <SvgXml xml={secureText ? IconsCloseEyse : IconsEyse} /> */}
          </TouchableOpacity>
        ) : (
          value?.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText("")} style={tw`ml-2`}>
              <Text style={tw`text-gray text-sm`}>✕</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Error */}
      {showError && (
        <Text style={tw`text-red text-xs mt-1 ml-2 font-geist-regular`}>
          {error}
        </Text>
      )}
    </View>
  )
}

export default MainInput
