import { View, Text } from "react-native";
import moment from "moment";

const InvoiceHeader = ({ invoiceId, issueDate }) => {
  const formatted = moment(issueDate).format("MMMM D, YYYY");

  return (
    <View className="bg-[#1A73E8] pt-[3%]  pb-[8%] px-[6%]">
      {/* Invoice content */}
      <View className="items-center">
        <Text className="text-white text-2xl font-poppins-bold mb-[2%]">
          INVOICE
        </Text>
        <Text className="text-white font-poppins text-sm mb-[1%] opacity-90">
          #INV-{invoiceId}
        </Text>
        <Text className="text-white font-poppins text-xs opacity-80">
          Issued: {formatted}
        </Text>
      </View>
    </View>
  );
};

export default InvoiceHeader;
