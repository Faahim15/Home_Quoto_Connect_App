import { View, Text } from "react-native";
import OfferPrice from "./OfferPrice";
import { useDispatch, useSelector } from "react-redux";
import { setJobField } from "../../../../redux/features/jobPost/jobPostSlice";

const PriceSlider = () => {
  const dispatch = useDispatch();
  const priceRange = useSelector((state) => state.jobPost.priceRange);

  const handlePriceChange = (field, value) => {
    const newValue = { ...priceRange, [field]: value };

    // ✅ CLIENT-SIDE VALIDATION: Prevent invalid values
    if (field === "from" && value > priceRange.to && priceRange.to > 0) {
      // If from > to, don't update and show error in form validation
      return;
    }

    if (field === "to" && value < priceRange.from && priceRange.from > 0) {
      // If to < from, don't update and show error in form validation
      return;
    }

    dispatch(
      setJobField({
        field: "priceRange",
        value: newValue,
      })
    );
  };

  return (
    <View className="mb-[2%]">
      <Text className="font-poppins-semiBold text-[#6B7280] text-base mb-[3%]">
        Price Range
      </Text>

      <View className="flex-row justify-between">
        {/* FROM */}
        <View className="flex-1 mr-[3%]">
          <Text className="font-poppins-500medium text-xs text-[#6B7280] mb-[2%]">
            From
          </Text>
          <OfferPrice
            value={priceRange.from}
            onChange={(val) => handlePriceChange("from", val)}
            verticalPadding={11}
            isPersonalized={priceRange.isPersonalized}
          />
        </View>

        {/* TO */}
        <View className="flex-1 ml-[3%]">
          <Text className="font-poppins-500medium text-xs text-[#6B7280] mb-[2%]">
            To
          </Text>
          <OfferPrice
            value={priceRange.to}
            onChange={(val) => handlePriceChange("to", val)}
            verticalPadding={11}
            isPersonalized={priceRange.isPersonalized}
          />
        </View>
      </View>

      {/* ✅ OPTIONAL: Show immediate validation feedback */}

      {priceRange.from === 0 && !priceRange.isPersonalized && (
        <Text className="font-poppins-medium text-xs text-red-500 mt-2">
          Minimum price must be greater than 0
        </Text>
      )}

      {priceRange.from > 0 &&
        priceRange.to >= 0 &&
        priceRange.from > priceRange.to && (
          <Text className="font-poppins-medium text-xs text-red-500 mt-2">
            Minimum price cannot be greater than maximum price
          </Text>
        )}

      {priceRange.from > 0 &&
        priceRange.to > 0 &&
        priceRange.from === priceRange.to && (
          <Text className="font-poppins-medium text-xs text-red-500 mt-2">
            Minimum and maximum price cannot be the same
          </Text>
        )}
    </View>
  );
};

export default PriceSlider;
