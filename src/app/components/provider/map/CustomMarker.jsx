import { View, Text } from "react-native";
import { Marker } from "react-native-maps";

const CustomMarker = ({ user, onPress }) => (
  <Marker coordinate={user.coordinate} onPress={() => onPress(user)}>
    <View className="w-12 h-12 rounded-full bg-blue-500 border-3 border-white shadow-lg items-center justify-center">
      <Text className="text-lg">{user.avatar}</Text>
    </View>
  </Marker>
);

export default CustomMarker;
