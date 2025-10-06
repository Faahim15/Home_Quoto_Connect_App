import { View, ScrollView } from "react-native";
import { QuoteCompletedData } from "../components/data/jobs/QuotesData";
import { useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/services/CustomTitle";
import QuoteProgressDetails from "../components/tabs/myJobs/QuoteProgressDetails";
export default function ProgressQuote() {
  const { serviceId } = useLocalSearchParams();

  const item = QuoteCompletedData.find((s) => s.id.toString() === serviceId);

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[4%]">
        <CustomTitle title="Quote Details" />
      </View>
      <ScrollView>
        <QuoteProgressDetails showStatus={true} item={item} />
      </ScrollView>
    </View>
  );
}
