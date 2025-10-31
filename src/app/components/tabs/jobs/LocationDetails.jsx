import { View, Text } from "react-native";
import LocationField from "./LocationField";
import { useDispatch, useSelector } from "react-redux";
import { setJobField } from "../../../../redux/features/jobPost/jobPostSlice";

export default function LocationDetails({ validationErrors }) {
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);
  console.log("see error:", validationErrors);
  // 🔄 Common handler for all input changes
  const handleInputChange = (field, value) => {
    dispatch(setJobField({ field, value }));
  };
  // ✅ Continue to next screen

  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-500medium text-base text-[#1F2937] ">
        Enter your location address
      </Text>
      <View>
        <LocationField
          // value={jobData.houseNumber}
          onChangeText={(value) => handleInputChange("houseNumber", value)}
          placeholder="Enter house number"
          keyboardType="numeric"
          label="House number"
          validationErrors={validationErrors.houseNumber}
        />
        <LocationField
          // value={jobData.streetNumber}
          onChangeText={(value) => handleInputChange("streetNumber", value)}
          placeholder="Enter street number"
          keyboardType="default"
          label="Street number"
          validationErrors={validationErrors.streetNumber}
        />
        <LocationField
          // value={jobData.completeAddress}
          onChangeText={(value) => handleInputChange("completeAddress", value)}
          placeholder="House no, street name, city, postal code"
          keyboardType="default"
          label="Complete Address"
          validationErrors={validationErrors.completeAddress}
        />
      </View>
    </View>
  );
}
