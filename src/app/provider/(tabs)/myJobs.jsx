import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import QuotesRequestScreen from "../../components/provider/myJobs/QuoteRequestScreen";
import AcceptJobsScreen from "../../components/provider/myJobs/AcceptJobScreen";
import CancelledJobs from "../../components/provider/myJobs/CancelledJobs";

const ContractorJobScreen = () => {
  const [activeTab, setActiveTab] = useState("Quote Requests");

  const tabs = ["Quote Requests", "Accepted Jobs", "Cancelled Jobs"];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Accepted Jobs":
        return <AcceptJobsScreen />;
      case "Cancelled Jobs":
        return <CancelledJobs />;
      default:
        return <QuotesRequestScreen />;
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

export default ContractorJobScreen;
