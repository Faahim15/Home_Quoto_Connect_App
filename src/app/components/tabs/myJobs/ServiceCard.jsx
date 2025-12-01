import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Services from "./Jobs";
import QuoteProgressScreen from "./screens/QuoteProgressScreen";
import QuoteUnpaidScreen from "./screens/QuoteUnpaidScreen";
import AllQuoteScreen from "./screens/AllQuoteScreen";
import CompletedQuote from "./screens/CompletedQuote";
import CancelledQuote from "./screens/CancelledQuote";

const ServiceCard = () => {
  const [activeTab, setActiveTab] = useState("My Jobs");

  const tabs = ["My Jobs", "Quotes", "In Progress", "Completed", "Cancelled"];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "My Jobs":
        return <AllQuoteScreen />;
      case "In Progress":
        return <QuoteProgressScreen />;
      case "Completed":
        return <CompletedQuote />;
      case "Cancelled":
        return <CancelledQuote />;
      default:
        return <Services />;
    }
  };

  return (
    <View className="w-full px-[3%] bg-[#f9f9f9] rounded-lg shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <View className="border-b border-[#C8C8C8] bg-[#f9f9f9]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={{ paddingHorizontal: 20, paddingVertical: 12 }}
              className={`${
                activeTab === tab ? "bg-white border-b-2 border-[#175994]" : ""
              }`}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                className={`text-base font-poppins-400regular whitespace-nowrap ${
                  activeTab === tab ? "text-[#175994]" : "text-[#6B7280]"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dynamic Content */}
      {renderContent()}
    </View>
  );
};

export default ServiceCard;
