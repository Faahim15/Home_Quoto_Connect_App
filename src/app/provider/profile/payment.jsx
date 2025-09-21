import React, { useState } from "react";
import { View, Text } from "react-native";
import PaymentMethodCard, {
  AddNewCardButton,
} from "../../components/provider/profile/PaymentOptions";
import CustomTitle from "../../components/shared/services/CustomTitle";
import { router } from "expo-router";

const PaymentMethodScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: "card",
      title: "Card",
      icon: "card",
      iconColor: "#EC4899",
      iconBackgroundColor: "#FDF2F8",
    },
    {
      id: "bank",
      title: "Bank account",
      icon: "business",
      iconColor: "#3B82F6",
      iconBackgroundColor: "#EFF6FF",
    },
    {
      id: "paypal",
      title: "PayPal",
      icon: "logo-paypal",
      iconColor: "#0070BA",
      iconBackgroundColor: "#EFF6FF",
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleAddNewCard = () => {
    // // Navigate to add new card screen
    // navigation.navigate("AddNewCardScreen");
    router.push("/provider/profile/addCard");
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 px-[5%] py-[4%]">
        {/* Header */}
        <CustomTitle title="Payment" />
        <View className="mt-[3%]">
          <Text className="text-base font-poppins-500medium text-[#565656] mb-[2%]">
            Select Payment method
          </Text>
        </View>

        {/* Payment Methods using reusable component */}
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            id={method.id}
            title={method.title}
            icon={method.icon}
            iconColor={method.iconColor}
            iconBackgroundColor={method.iconBackgroundColor}
            isSelected={selectedMethod === method.id}
            onPress={handleMethodSelect}
          />
        ))}

        {/* Add spacing before Add New Card button */}
        <View className="mt-[3%]" />

        {/* Add New Card Button using reusable component */}
        <AddNewCardButton onPress={handleAddNewCard} title="Add new card" />
      </View>
    </View>
  );
};

export default PaymentMethodScreen;
