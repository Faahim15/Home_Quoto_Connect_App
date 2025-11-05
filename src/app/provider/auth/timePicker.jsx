import { View } from "react-native";
import CustomHeader from "../../components/auth/CustomHeader";
import TimeRangePicker from "../../components/provider/auth/TimeRangePicker";

export default function WorkingHoursScreen() {
  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Your" nestedTitle="working hours" />
      <TimeRangePicker />
    </View>
  );
}
