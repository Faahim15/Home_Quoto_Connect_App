import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";

export default function ProviderFilterModal({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
}) {
  const updateField = (key, value) => {
    onApply({ ...filters, [key]: value });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-[rgba(0,0,0,0.4)] justify-center items-center">
        <View className="w-[80%] bg-white rounded-xl p-5">
          <Text className="text-lg font-poppins-semibold text-center mb-4">
            Filter Providers
          </Text>

          {/* MIN RATING */}
          <Text className="font-poppins-medium mb-1">Min Rating</Text>
          <TextInput
            placeholder="e.g. 4"
            className="border p-3 rounded-md mb-3"
            keyboardType="numeric"
            value={filters.minRating?.toString()}
            onChangeText={(val) => updateField("minRating", val)}
          />

          {/* MAX DISTANCE */}
          <Text className="font-poppins-medium mb-1">Max Distance (km)</Text>
          <TextInput
            placeholder="e.g. 10"
            className="border p-3 rounded-md mb-3"
            keyboardType="numeric"
            value={filters.maxDistance?.toString()}
            onChangeText={(val) => updateField("maxDistance", val)}
          />

          {/* SORT BY */}
          <Text className="font-poppins-medium mb-1">Sort By</Text>
          <TouchableOpacity
            onPress={() =>
              updateField("sortBy", filters.sortBy === "rating" ? "" : "rating")
            }
            className="border p-3 rounded-md mb-3"
          >
            <Text>{filters.sortBy || "Default"}</Text>
          </TouchableOpacity>

          {/* CATEGORY */}
          <Text className="font-poppins-medium mb-1">Category</Text>
          <TouchableOpacity
            onPress={() =>
              updateField(
                "serviceCategory",
                filters.serviceCategory ? "" : "Plumbing"
              )
            }
            className="border p-3 rounded-md mb-4"
          >
            <Text>{filters.serviceCategory || "Any"}</Text>
          </TouchableOpacity>

          {/* BUTTONS */}
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onReset}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              <Text>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="bg-[#0054A5] px-4 py-2 rounded-md"
            >
              <Text className="text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
