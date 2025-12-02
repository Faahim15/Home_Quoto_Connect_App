import { View, Text, Modal, TouchableOpacity } from "react-native";
import DropdownMenu from "../../../provider/profile/DropdownMenu";
import { useGetServiceCategoriesQuery } from "../../../../../redux/features/apiSlices/user/createJobSlices";

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
  const { data, isLoading } = useGetServiceCategoriesQuery();

  // Rating options 1-5
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-[rgba(0,0,0,0.4)] justify-center items-center">
        <View className="w-[80%] bg-white rounded-xl p-5">
          {/* CLOSE BUTTON */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-2 right-2 p-2"
          >
            <Text className="text-lg font-bold">✕</Text>
          </TouchableOpacity>

          <Text className="text-lg font-poppins-semibold text-center mb-4">
            Filter Providers
          </Text>

          {/* MIN RATING */}
          {/* <Text className="font-poppins-medium mb-1">Min Rating</Text> */}
          <DropdownMenu
            isLoading={false}
            placeholder="Select Rating"
            options={ratingOptions}
            selectedValue={filters.minRating}
            onSelect={(field, value) => updateField("minRating", value)}
            field="minRating"
          />

          {/* CATEGORY DROPDOWN */}
          <DropdownMenu
            isLoading={isLoading}
            placeholder="Select Your service"
            options={data?.data?.categories}
            selectedValue={filters.serviceCategory}
            onSelect={(field, value) => updateField(field, value)}
            field="serviceCategory"
          />

          {/* BUTTONS */}
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              onPress={onReset}
              className="bg-gray-300 px-4 py-2 rounded-md"
            >
              <Text>Reset</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={onClose}
              className="bg-[#0054A5] px-4 py-2 rounded-md"
            >
              <Text className="text-white">Apply</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
}
