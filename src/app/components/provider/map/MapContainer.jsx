import { View, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import JobMarker from "./JobMarker";
import CustomMarker from "./CustomMarker";
import UserLocationMarker from "./UserLocationMarker";

const MapContainer = ({
  mapRef,
  initialRegion,
  nearbyJobs,
  userLocation,
  onMarkerPress,
  onGetLocation,
}) => {
  return (
    <View className="flex-1 relative">
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        mapType="standard"
        customMapStyle={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ]}
      >
        {nearbyJobs.map((job) => (
          <JobMarker key={job._id} job={job} onPress={onMarkerPress} />
        ))}

        <UserLocationMarker userLocation={userLocation} />
      </MapView>

      <TouchableOpacity
        onPress={onGetLocation}
        className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center"
      >
        <Ionicons name="locate" size={20} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
};

export default MapContainer;
