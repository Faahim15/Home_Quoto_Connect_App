import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Services from "./Jobs";
import QuoteProgressScreen from "./screens/QuoteProgressScreen";
import QuoteUnpaidScreen from "./screens/QuoteUnpaidScreen";
import AllQuoteScreen from "./screens/AllQuoteScreen";

const ServiceCard = () => {
  const [activeTab, setActiveTab] = useState("My Jobs");

  const tabs = ["My Jobs", "Quotes", "Progress", "Unpaid"];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "My Jobs":
        return <AllQuoteScreen />;
      case "Progress":
        return <QuoteProgressScreen />;
      case "Unpaid":
        return <QuoteUnpaidScreen />;
      default:
        return <Services />;
    }
  };

  return (
    <View className="w-full px-[3%] bg-[#f9f9f9] rounded-lg shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <View className="flex-row border-b border-[#C8C8C8] bg-[#f9f9f9]">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-[2%]  ${
              activeTab === tab ? "bg-white border-b border-[#175994]" : ""
            }`}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              className={`text-center text-base font-poppins-400regular ${
                activeTab === tab ? "text-[#175994]" : "text-[#6B7280]"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic Content */}
      {renderContent()}
    </View>
  );
};

export default ServiceCard;
