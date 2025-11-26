import { View } from "react-native";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const JobMarker = ({ job, onPress }) => {
  const longitude = job.location?.coordinates?.[0];
  const latitude = job.location?.coordinates?.[1];

  if (!longitude || !latitude) return null;

  return (
    <Marker
      coordinate={{
        latitude: latitude,
        longitude: longitude,
      }}
      onPress={() => onPress(job)}
    >
      <View className="w-12 h-12 rounded-full bg-cyan-500 border-3 border-white shadow-lg items-center justify-center">
        <Ionicons name="briefcase" size={20} color="white" />
      </View>
    </Marker>
  );
};

export default JobMarker;
