import  { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import LottieView from "lottie-react-native";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import InputField from "../components/tabs/profile/InputField";
import ActionButton from "../components/tabs/profile/ActionButton";
import Dropdown from "../components/tabs/profile/Dropdown";
import LiveChatModal from "../components/shared/modal/LiveChatModal";
import {
  useCreateSupportTicketMutation,
  useGetSupportTicketsQuery,
} from "../../redux/features/apiSlices/user/userApiSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SupportScreen() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    categoryLabel: "",
    priority: "",
    priorityLabel: "",
    description: "",
  });

  const [ticketId, setTicketId] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [role, setRole] = useState(null);
  const [hasInProgressTicket, setHasInProgressTicket] = useState(false);

  const [createSupportTicket, { isLoading }] = useCreateSupportTicketMutation();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const verifiedStatus = await AsyncStorage.getItem("isVerified");
        const userRole = await AsyncStorage.getItem("role");
        setIsVerified(verifiedStatus === "true");
        setRole(userRole);
      } catch (error) {
        console.error("Error reading verification status:", error);
        setIsVerified(false);
      }
    };

    checkVerificationStatus();
  }, []);

  const {
    data,
    isLoading: getSupportLoader,
    error,
  } = useGetSupportTicketsQuery();

  const categoryOptions = [
    { value: "technical", label: "Technical" },
    { value: "billing", label: "Billing" },
    { value: "account", label: "Account" },
    { value: "service", label: "Service" },
    { value: "general", label: "General" },
    { value: "report", label: "Report" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];


  useEffect(() => {
    if (data?.data?.tickets && data.data.tickets.length > 0) {
      // Prioritize in_progress ticket over open ticket
      const inProgressTicket = data.data.tickets.find(
        (ticket) => ticket.status === "in_progress"
      );

      const openTicket = data.data.tickets.find(
        (ticket) => ticket.status === "open"
      );

      const activeTicket = inProgressTicket || openTicket;

      if (activeTicket) {
        setTicketId(activeTicket._id);
      } else {
        setTicketId(null);
      }

      // Track if there's an in-progress ticket
      setHasInProgressTicket(!!activeTicket);
    }
  }, [data]);

 
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 
  const handleDropdownSelect = (field, value, label) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      [`${field}Label`]: label,
    }));
  };

  const handleSubmit = async () => {

    Keyboard.dismiss();


    if (role === "provider" && !isVerified) {
      Alert.alert(
        "Verification Required",
        "Please verify your account before submitting a support ticket."
      );
      return;
    }


    if (hasInProgressTicket) {
      Alert.alert(
        "Ticket In Progress",
        "You already have a ticket being processed. Please wait for it to be resolved."
      );
      return;
    }


    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a title for your issue");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please describe your issue");
      return;
    }
    if (!formData.category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!formData.priority) {
      Alert.alert("Error", "Please select a priority level");
      return;
    }

    try {
      const result = await createSupportTicket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
      }).unwrap();

      

 
      if (result?.data?.ticket?._id) {
        setTicketId(result.data.ticket._id);
      }

      Alert.alert(
        "Success",
        `Your support ticket has been submitted successfully!\nTicket ID: ${result?.data?.ticket?._id || "N/A"}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                title: "",
                category: "",
                categoryLabel: "",
                priority: "",
                priorityLabel: "",
                description: "",
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || "Failed to submit ticket. Please try again."
      );
    }
  };

  const handleLiveChat = () => {
    if (!ticketId) {
      Alert.alert(
        "No Ticket Found",
        "Please create a support ticket first before starting a live chat."
      );
      return;
    }
    setShowChatModal(true);
  };


  const isSendDisabled =
    isLoading || (role === "provider" && !isVerified) || hasInProgressTicket;



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}> 

        <CustomTitle title="Help & Support" withSafeTop={true} />
   

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: "6%",
              paddingBottom: verticalScale(20),
              backgroundColor: "#f9f9f9",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
      
            <View
              style={{ alignItems: "center", marginTop: verticalScale(12) }}
            >
              <LottieView
                source={require("../../../assets/animations/support.json")}
                autoPlay
                loop={false}
                style={{ width: scale(300), height: verticalScale(200) }}
              />
            </View>

            <Text className="font-poppins-500medium text-base text-[#5C5F62] text-center mb-[3%]">
              Hello, how can we assist you?
            </Text>

            <InputField
              placeholder="Enter the title of your issue"
              label="Title"
              keyboardType="default"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />

            <Dropdown
              label="Category"
              value={formData.categoryLabel}
              options={categoryOptions}
              onSelect={(value, label) =>
                handleDropdownSelect("category", value, label)
              }
              placeholder="Select a category"
            />

            <Dropdown
              label="Priority"
              value={formData.priorityLabel}
              options={priorityOptions}
              onSelect={(value, label) =>
                handleDropdownSelect("priority", value, label)
              }
              placeholder="Select priority level"
            />

            <View style={{ marginTop: verticalScale(12) }}>
              <Text className="font-poppins-400regular text-base text-[#5C5F62]">
                Write your issue here
              </Text>

              <TextInput
                className="text-black font-poppins-400regular bg-[#fff] border rounded-md border-[#CACACA] px-[3%] mt-[2%]"
                placeholder="Write here.."
                placeholderTextColor="#898989"
                multiline
                textAlignVertical="top"
                style={{ minHeight: verticalScale(120), paddingTop: 12 }}
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
              />
            </View>

            {/* Buttons */}
            <View style={{ marginTop: verticalScale(20), marginBottom: verticalScale(40) }}>
              <View style={{ position: "relative" }}>
                <ActionButton
                  title={isLoading ? "Sending..." : "Send"}
                  onPress={handleSubmit}
                  disabled={isSendDisabled}
                  backgroundColor={isSendDisabled ? "#E0E0E0" : undefined}
                />
                {isLoading && (
                  <View
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                      top: verticalScale(14),
                    }}
                  >
                    <ActivityIndicator size="small" color="#FFF" />
                  </View>
                )}
              </View>

              <ActionButton
                backgroundColor={!ticketId ? "#E0E0E0" : "#F9F9F9"}
                borderColor={!ticketId ? "#CACACA" : "#0054A5"}
                title="Live Chat"
                color={!ticketId ? "#898989" : "#0054A5"}
                onPress={handleLiveChat}
                disabled={!ticketId || isLoading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Live Chat Modal */}
        <LiveChatModal
          visible={showChatModal}
          onClose={() => setShowChatModal(false)}
          ticketId={ticketId}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
