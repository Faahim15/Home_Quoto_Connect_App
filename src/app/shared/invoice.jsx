import { View, ScrollView } from "react-native";
import React from "react";
import InvoiceHeader from "../components/shared/invoice/InvoiceHeader";
import ServiceInfo from "../components/shared/invoice/ServiceInfo";
import {
  avatar1,
  avatar2,
  locationIcon,
  settingsIcon,
} from "../../../assets/svg/icons";
import Service from "../components/shared/invoice/Service";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import Pricing from "../components/shared/invoice/Pricing";
import PaymentInfo from "../components/shared/invoice/PaymentInfo";
import InvoiceButton from "../components/shared/invoice/InvoiceButton";
import { router } from "expo-router";
export default function Invoice() {
  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(80) }}
        showsVerticalScrollIndicator={false}
      >
        <InvoiceHeader />
        <ServiceInfo
          serviceDetails={{
            svgIcon: avatar1,
            name: "John Doe",
            role: "Service Provider",
            serviceType: "Plumbing Services",
            address: "123 Main Street, Toronto, ON M5V 2T6",
            phone: "(416) 555-0123",
            gmail: "john@doeplumbing.com",
          }}
        />
        <ServiceInfo
          serviceDetails={{
            svgIcon: avatar2,
            name: "Jane Smith",
            role: "Customer",
            address: "456 Oak Avenue, Toronto, ON M4W 1A8",
            phone: "(416) 555-0456",
            gmail: "jane.smith@email.com",
          }}
        />

        {/* sevice details */}

        <Service
          services={{
            svgIcon: settingsIcon,
            title: "Service Details",
            subtitle: "Plumbing Service – Leak Fixing",
            description:
              "Fixed water leakage under the sink in the kitchen and replaced the old pipe with a new one. Tested all connections for proper sealing.",
          }}
        />
        {/* location details */}
        <Service
          services={{
            svgIcon: locationIcon,
            title: "Work Location",
            description: "456 Oak Avenue, Toronto, ON M4W 1A8",
          }}
        />
        {/* pricing breakdown */}
        <Pricing />

        {/* payment information */}
        <PaymentInfo />
      </ScrollView>
      {/* button */}
      <InvoiceButton onPress={() => router.replace("/home")} />
    </View>
  );
}
