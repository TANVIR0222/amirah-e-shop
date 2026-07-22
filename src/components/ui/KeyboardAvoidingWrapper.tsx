import { ReactNode } from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import tw from "twrnc"

type KeyboardAvoidingWrapperProps = {
  children: ReactNode
  contentContainerStyle?: object
  keyboardVerticalOffset?: number
}

const KeyboardAvoidingWrapper = ({
  children,
  contentContainerStyle = {},
  keyboardVerticalOffset = 0,
}: KeyboardAvoidingWrapperProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={tw`flex-1 `}>{children}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
})

export default KeyboardAvoidingWrapper
