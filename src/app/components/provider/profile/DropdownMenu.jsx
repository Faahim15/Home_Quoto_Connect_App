import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../adaptive/Adaptiveness";
import { useState } from "react";
import Error from "../../shared/error/Error";

const DropdownMenu = ({
  isLoading,
  placeholder,
  options,
  selectedValue,
  onSelect,
  field,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (field, value) => {
    onSelect(field, value);
    setIsOpen(false);
  };

  return (
    <View className="w-full mb-[4%]">
      <TouchableOpacity
        style={{ height: verticalScale(48) }}
        className="w-full bg-white border border-gray-300 rounded-lg px-[4%] flex-row items-center justify-between"
        onPress={() => !isLoading && setIsOpen(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#6B7280" />
            <Text className="text-base font-poppins-500medium text-gray-500 ml-2">
              Loading...
            </Text>
          </View>
        ) : (
          <>
            <Text
              className={`text-base font-poppins-500medium ${selectedValue ? "text-gray-800" : "text-gray-500"}`}
            >
              {selectedValue || placeholder}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </>
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen && !isLoading}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center px-[4%]"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="w-full bg-white rounded-lg shadow-lg max-h-80">
            {isLoading ? (
              <View className="py-8 justify-center items-center">
                <ActivityIndicator size="large" color="#6B7280" />
                <Text className="text-gray-500 font-poppins-400regular mt-2">
                  Loading options...
                </Text>
              </View>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="px-[4%] py-[3%] border-b border-gray-100"
                    onPress={() => handleSelect(field, item?.title || item)}
                  >
                    <Text className="text-base font-poppins-400regular text-gray-800">
                      {item?.title || item}
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Error error={error} />
    </View>
  );
};

export default DropdownMenu;
