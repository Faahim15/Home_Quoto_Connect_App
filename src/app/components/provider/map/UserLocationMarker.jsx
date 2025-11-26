import { View } from "react-native";
import { Marker } from "react-native-maps";

const UserLocationMarker = ({ userLocation }) =>
  userLocation && (
    <Marker coordinate={userLocation}>
      <View className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />
    </Marker>
  );

export default UserLocationMarker;
