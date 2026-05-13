import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import QuotesRequestScreen from "../../components/provider/myJobs/QuoteRequestScreen";
import AcceptJobsScreen from "../../components/provider/myJobs/AcceptJobScreen";
import CancelledJobs from "../../components/provider/myJobs/CancelledJobs";
import CompletedJobs from "../../components/provider/myJobs/CompletedJobs";

const ContractorJobScreen = () => {
  const [activeTab, setActiveTab] = useState("Quote Requests");

  const tabs = ["Quote Requests", "In Progress", "Cancelled", "Completed"];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "In Progress":
        return <AcceptJobsScreen />;
      case "Cancelled":
        return <CancelledJobs />;
      case "Completed":
        return <CompletedJobs />;
      default:
        return <QuotesRequestScreen />;
    }
  };

  return (
    <View className="flex-1 w-full px-[3%] bg-[#f9f9f9] rounded-lg shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <View className="border-b border-[#C8C8C8] bg-[#f9f9f9]">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <Pressable
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
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Dynamic Content */}
      {renderContent()}
    </View>
  );
};

export default ContractorJobScreen;
