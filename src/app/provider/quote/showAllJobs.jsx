import { View } from "react-native";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
import CustomTitle from "../../components/shared/CustomTitle";
import { useLocalSearchParams } from "expo-router";
export default function ShowAllJobs() {
  const { title } = useLocalSearchParams();
  return (
    <View className="flex-1  bg-[#f9f9f9] ">
      <CustomTitle title={title} withSafeTop={false} />
      <ShowAllServiceCards horizontal={false} />
    </View>
  );
}
