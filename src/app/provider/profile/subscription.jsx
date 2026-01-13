import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomTitle from "../../components/shared/services/CustomTitle";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { router } from "expo-router";
import { useGetSubscriptionPackageQuery } from "../../../redux/features/apiSlices/payment/paymentApiSlice";

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data, isLoading, error } = useGetSubscriptionPackageQuery();

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#f9f9f9] items-center justify-center">
        <ActivityIndicator size="large" color="#175994" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#f9f9f9] items-center justify-center px-[6%]">
        <Text className="text-red-500 text-base font-poppins-500medium text-center">
          Failed to load subscription packages
        </Text>
      </View>
    );
  }

  const subscriptions = data?.data?.subscriptions || [];

  if (subscriptions.length === 0) {
    return (
      <View className="flex-1 bg-[#f9f9f9] items-center justify-center px-[6%]">
        <Text className="text-gray-500 text-base font-poppins-500medium text-center">
          No subscription packages available
        </Text>
      </View>
    );
  }

  // Set default selected plan to the first one if not selected
  if (!selectedPlan && subscriptions.length > 0) {
    setSelectedPlan(subscriptions[0]._id);
  }

  const getPlanIcon = (type) => {
    switch (type) {
      case "monthly":
        return "⏰";
      case "6months":
        return "🏅";
      case "yearly":
        return "📅";
      default:
        return "📋";
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getPeriodText = (type) => {
    switch (type) {
      case "monthly":
        return "/month";
      case "6months":
        return "/6 months";
      case "yearly":
        return "/year";
      default:
        return "";
    }
  };

  const getSelectedPlanName = () => {
    const plan = subscriptions.find((p) => p._id === selectedPlan);
    return plan || "";
  };

  console.log("subscripito plan", getSelectedPlanName()?._id);

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      {/* <View className="px-[6%]">
        <CustomTitle title="Subscription" />
      </View> */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        className="flex-1 px-[6%] py-[3%]"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-[4%]">
          {subscriptions.map((plan) => (
            <TouchableOpacity
              key={plan._id}
              onPress={() => setSelectedPlan(plan._id)}
              className={`
                ${selectedPlan === plan._id ? "bg-blue-50 border-[#175994]" : "bg-white border-gray-300"} 
                ${selectedPlan === plan._id ? "opacity-100" : "opacity-75"} 
                border-2 rounded-xl p-[5%] shadow-sm
              `}
              activeOpacity={1}
            >
              {/* Header with Icon and Title */}
              <View className="flex-row items-center justify-between mb-[4%]">
                <View className="flex-row items-center">
                  <View className="relative">
                    <Text className="text-3xl mr-[3%]">
                      {getPlanIcon(plan.type)}
                    </Text>
                  </View>
                  <Text className="text-base font-poppins-500medium text-[#175994]">
                    {plan.name}
                  </Text>
                </View>
                {plan.isPopular && (
                  <View className="bg-orange-500 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-poppins-semiBold">
                      Popular
                    </Text>
                  </View>
                )}
              </View>

              {/* Description */}
              {plan.description && (
                <Text className="text-[#0F161C] font-poppins-400regular text-xs mb-[4%] leading-5">
                  {plan.description}
                </Text>
              )}

              {/* Discount Badge */}
              {plan.discount > 0 && (
                <View className="mb-[3%]">
                  <View className="bg-green-100 border border-green-300 rounded-lg px-3 py-2 self-start">
                    <Text className="text-green-700 font-poppins-semiBold text-xs">
                      Save {plan.discount}%
                    </Text>
                  </View>
                </View>
              )}

              {/* Features List */}
              <View className="mb-[5%]">
                {plan.features.map((feature, index) => (
                  <View
                    key={feature._id || index}
                    className="flex-row items-start mb-[2%]"
                  >
                    <Text
                      className={`${
                        feature.included ? "text-[#175994]" : "text-gray-400"
                      } text-base mr-[2%]`}
                    >
                      {feature.included ? "✓" : "✗"}
                    </Text>
                    <Text
                      className={`${
                        feature.included ? "text-[#0F161C]" : "text-gray-400"
                      } font-poppins-400regular text-xs flex-1 leading-5`}
                    >
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Price Section */}
              <View className="border-t flex-row justify-between border-[#DCDCDC] pt-[4%]">
                <View>
                  <Text className="text-[#1F2937] text-base font-poppins-400regular mb-[1%]">
                    Price
                  </Text>
                  {plan.discount > 0 && (
                    <Text className="text-gray-400 text-xs font-poppins-400regular line-through">
                      {formatPrice(plan.originalPrice)}
                    </Text>
                  )}
                </View>
                <View className="flex-row items-baseline">
                  <Text className="text-[#F59E0B] text-lg font-poppins-semiBold">
                    {formatPrice(plan.price)}
                  </Text>
                  <Text className="text-[#F59E0B] font-poppins-semiBold text-base ml-1">
                    {getPeriodText(plan.type)}
                  </Text>
                </View>
              </View>

              {/* Selection Indicator */}
              {selectedPlan === plan._id && (
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
        onPress={() =>
          router.push({
            pathname: "/provider/profile/subscriptionPayment",
            params: { subscriptionId: getSelectedPlanName()?._id },
          })
        }
        className="bg-[#0054A5] rounded-xl py-[4%] mx-[6%] mb-[3%]"
        activeOpacity={1}
      >
        <Text className="text-white text-center text-base font-poppins-bold">
          Continue with {getSelectedPlanName()?.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriptionScreen;
