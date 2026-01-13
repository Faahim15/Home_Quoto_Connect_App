import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#175994",
          tabBarInactiveTintColor: "#000000",
          tabBarStyle: {
            height: verticalScale(74),
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            paddingBottom: verticalScale(0),
            paddingTop: verticalScale(0),
            borderBottomLeftRadius: scale(10),
            borderBottomRightRadius: scale(10),
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: verticalScale(10),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
            // fontFamily: "Poppins_400Regular",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: "Jobs",
            tabBarIcon: ({ color, size }) => (
              <View style={{ width: size, height: size }}>
                <Ionicons
                  name="document-text-outline"
                  size={size}
                  color={color}
                />
                <Ionicons
                  name="add-circle"
                  size={size * 0.4}
                  color={color}
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -1,
                    backgroundColor: "#fff",
                    borderRadius: 999,
                  }}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="myJobs"
          options={{
            title: "My Jobs",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="reader-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "chat",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
