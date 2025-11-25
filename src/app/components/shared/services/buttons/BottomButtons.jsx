import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { scale } from "../../../adaptive/Adaptiveness";

export default function BotttomButtons({
  title,
  backgroundColor,
  borderColor,
  color,
  width = 148,
  onPress,
  disabled,
  loading,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: scale(width),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: scale(1),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: scale(10),
        borderRadius: scale(8),
      }}
      disabled={disabled || loading} // disable while loading
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text style={{ color: color }} className="font-poppins-bold text-base">
          {title}
        </Text>
      )}
    </Pressable>
  );
}
