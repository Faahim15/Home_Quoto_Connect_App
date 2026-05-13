import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import DropdownMenu from "../../components/provider/profile/DropdownMenu";
import { useGetServiceCategoriesQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import ProjectDate from "../../components/provider/profile/ProjectDate";
import { useState } from "react";
import InputField from "../../components/tabs/profile/InputField";
import PhotoUpload from "./PhotoUpload";
import AddMoreButton from "../../components/provider/profile/AddMoreButton";
import { useCreateProjectGalleryMutation } from "../../../redux/features/apiSlices/user/userApiSlices";
import { router } from "expo-router";
import { toast } from "sonner-native";

export default function ProjectGalleryForm() {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    projectDate: null,
    images: [],
  });

  const { data, isLoading } = useGetServiceCategoriesQuery();
  const [createPortpolio, { isLoading: portfolioLoader }] =
    useCreateProjectGalleryMutation();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      projectDate: date,
    }));
  };

  const handleImagesChange = (newImages) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const formatDate = (dateObj) => {
    const d = new Date(dateObj);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      return toast.error("Project title is required. Please enter a title.");
    }

    if (!formData.category) {
      return toast.error("Please select a service category to continue.");
    }

    if (!formData.projectDate) {
      return toast.error("Project date is required. Please pick a date.");
    }

    if (formData.images.length === 0) {
      return toast.error("Please upload at least one photo for your project.");
    }

    // 🔎 Find selected category object by title
    const selectedCategoryObj = data?.data?.categories?.find(
      (item) => item.title === formData.category,
    );

    if (!selectedCategoryObj) {
      return toast.error("Selected category not found. Please try again.");
    }

    const serviceCategoryId = selectedCategoryObj._id;

    // Convert date
    const formattedDate = formatDate(formData.projectDate);

    // =============================
    // ✅ Prepare payload
    // =============================
    const payload = {
      title: formData.title,
      serviceCategory: serviceCategoryId,
      projectDate: formattedDate,
      images: formData.images.map((uri, index) => ({
        uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      })),
    };

    // 🚀 Log payload before submitting
    console.log("📦 FINAL PAYLOAD:", payload);

    try {
      // =============================
      // 🔥 Submit API request
      // =============================
      const response = await createPortpolio(payload).unwrap();

      // 🚀 Log API response
      console.log("✅ API RESPONSE:", response);

      if (response?.success) {
        toast.success("Your project has been added successfully.");
        setFormData({});
        router.back();
      }
    } catch (error) {
      console.log("❌ API ERROR:", error);
      toast.error(error?.message || "Failed to add project. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-[#f9f9f9]"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-[6%] pb-6">
          <View className="mt-[3%]">
            <InputField
              placeholder="Enter project title.."
              label="Title"
              keyboardType="default"
              value={formData.title}
              onChangeText={(text) => handleInputChange("title", text)}
            />
          </View>

          <View className="mt-[3%]">
            <Text className="font-poppins-400regular mb-[1%] text-base text-[#5C5F62]">
              Select Service Category
            </Text>
            <DropdownMenu
              isLoading={isLoading}
              placeholder="Select Your service"
              options={data?.data?.categories}
              selectedValue={formData?.category}
              onSelect={handleInputChange}
              field="category"
            />
          </View>

          <ProjectDate
            value={formData.projectDate}
            onDateChange={handleDateChange}
          />

          <PhotoUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
          />
        </View>
      </ScrollView>
      {/* Add More Project Button */}
      <AddMoreButton
        loading={portfolioLoader}
        onPress={handleSubmit}
        title="Submit"
      />
    </KeyboardAvoidingView>
  );
}
