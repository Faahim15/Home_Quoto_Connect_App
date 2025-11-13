import { View } from "react-native";
import { verticalScale } from "../../../adaptive/Adaptiveness";
import AllJobs from "../AllJobs";
export default function AllQuoteScreen() {
  return (
    <View style={{ paddingBottom: verticalScale(0) }}>
      <AllJobs />
    </View>
  );
}
