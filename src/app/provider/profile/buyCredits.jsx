import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { router } from "expo-router";
import { useGetCreditsPackagesQuery } from "../../../redux/features/apiSlices/payment/paymentApiSlice";

const BuyCreditScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data, isLoading, error } = useGetCreditsPackagesQuery();

  const packages = data?.data?.packages || [];

  function buyCreditHandler() {
    if (!selectedPlan) return;

    router.push({
      pathname: "provider/profile/creditsPayment",
      params: { selectedPackageId: selectedPlan },
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#f9f9f9] items-center justify-center">
        <ActivityIndicator size="large" color="#0054A5" />
        <Text className="text-[#0F161C] font-poppins-400regular text-sm mt-4">
          Loading packages...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#f9f9f9] items-center justify-center px-[6%]">
        <Text className="text-red-500 font-poppins-500medium text-base text-center">
          Failed to load packages. Please try again.
        </Text>
      </View>
    );
  }

  const selectedPackage = packages.find((pkg) => pkg._id === selectedPlan);

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <CustomTitle title="Credits" withSafeTop={true} />

      {packages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-[10%]">
          <View className="bg-gray-100 p-6 rounded-full mb-4">
            <Text className="text-3xl">📦</Text>
          </View>
          <Text className="text-[#0F161C] font-poppins-600semiBold text-lg text-center">
            No Packages Available
          </Text>
          <Text className="text-gray-500 font-poppins-400regular text-sm text-center mt-2">
            We couldn't find any credit packages at the moment. Please check back later or contact support.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{ paddingBottom: verticalScale(180) }}
            className="flex-1 px-[6%] "
            showsVerticalScrollIndicator={false}
          >
            <View className="mt-[3%] gap-[3%]">
              {packages.map((pkg) => (
                <TouchableOpacity
                  key={pkg._id}
                  onPress={() => setSelectedPlan(pkg._id)}
                  className={`${
                    selectedPlan === pkg._id
                      ? "bg-blue-50 border-[#175994]"
                      : "bg-white border-gray-300"
                  } ${
                    selectedPlan === pkg._id ? "opacity-100" : "opacity-75"
                  } border-2 rounded-xl p-[5%] shadow-sm`}
                  activeOpacity={1}
                >
                  {/* Popular Badge */}
                  {pkg.isPopular && (
                    <View className="absolute -top-2 left-4 bg-[#F59E0B] px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-poppins-semiBold">
                        POPULAR
                      </Text>
                    </View>
                  )}

                  {/* Header with Title */}
                  <View className="flex-row border-b border-[#dcdcdc] pb-[2%] items-center mb-[4%]">
                    <Text className="text-base font-poppins-500medium text-[#175994]">
                      {pkg.name}
                    </Text>
                  </View>

                  {/* Credits Count */}
                  <View className="mb-[3%]">
                    <Text className="text-[#0F161C] font-poppins-semiBold text-xl">
                      {pkg.credits} Credits
                    </Text>
                  </View>

                  {/* Description */}
                  <View className="mb-[5%]">
                    <View className="flex-row items-start mb-[2%]">
                      <Text className="text-[#175994] text-base mr-[2%]">✓</Text>
                      <Text className="text-[#0F161C] font-poppins-400regular text-xs flex-1 leading-5">
                        {pkg.description}
                      </Text>
                    </View>
                  </View>

                  {/* Price Section */}
                  <View className="border-t flex-row justify-between items-center border-[#DCDCDC] pt-[4%]">
                    <View>
                      <Text className="text-[#1F2937] text-sm font-poppins-400regular mb-[1%]">
                        Price
                      </Text>
                      {pkg.discount > 0 && (
                        <View className="flex-row items-center gap-2">
                          <Text className="text-[#9CA3AF] text-xs font-poppins-400regular line-through">
                            ${pkg.originalPrice}
                          </Text>
                          <View className="bg-green-100 px-2 py-0.5 rounded">
                            <Text className="text-green-700 text-xs font-poppins-semiBold ">
                              {pkg.discount}% OFF
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                    <View className="flex-row items-baseline">
                      <Text className="text-[#F59E0B] text-xl font-poppins-semiBold">
                        ${pkg.price}
                      </Text>
                    </View>
                  </View>

                  {/* Selection Indicator */}
                  {selectedPlan === pkg._id && (
                    <View className="absolute top-[3%] right-[3%]">
                      <View className="bg-[#175994] rounded-full w-6 h-6 items-center justify-center">
                        <Text className="text-white text-xs">✓</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={buyCreditHandler}
            disabled={!selectedPlan}
            className={`${
              selectedPlan ? "bg-[#0054A5]" : "bg-gray-300"
            } rounded-xl py-[4%] mx-[6%] mb-[15%]`}
            activeOpacity={1}
          >
            <Text className="text-white text-center text-base font-poppins-bold">
              {selectedPackage
                ? `Continue with ${selectedPackage.name}`
                : "Select a Plan to Continue"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default BuyCreditScreen;