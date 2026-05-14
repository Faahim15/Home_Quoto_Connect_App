import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  RefreshControl,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CustomTitle from "../../components/shared/CustomTitle";
import { scale, verticalScale } from "../../components/adaptive/Adaptiveness";
import AddMoreButton from "../../components/provider/profile/AddMoreButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetProviderProfileDetailsQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import { useFocusEffect, router } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ProjectGalleryScreen = () => {
  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          // console.log("Fetched userId:", storedUserId);
        } else {
          console.log("No userId found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };
    fetchUserId();
  }, []);

  const { data, isLoading, error, refetch } = useGetProviderProfileDetailsQuery(
    userId,
    {
      skip: !userId,
    },
  );

  useEffect(() => {
    if (data?.data?.portfolio) {
      const formattedProjects = data.data.portfolio.map((project) => ({
        id: project._id,
        title: project.title || "Untitled Project",
        serviceCategory: project.serviceCategory?.title || "",
        projectDate: project.projectDate,
        images: project.images.map((image) => ({
          id: image._id,
          uri: image.url,
          type: image.imageType || "during",
        })),
      }));
      setProjects(formattedProjects);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetch();
      }
    }, [userId]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload images!",
      );
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset, index) => ({
          id: Date.now() + index,
          uri: asset.uri,
          type: "after",
        }));

        const newProject = {
          id: Date.now(),
          title: `Project ${projects.length + 1}`,
          images: newImages,
        };

        setProjects((prevProjects) => [...prevProjects, newProject]);

        Alert.alert(
          "Success",
          `Added ${newImages.length} image(s) to new project!`,
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
      console.error("Image picker error:", error);
    }
  };

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
    setSelectedImage(null);
  };

  const toggleImageType = (projectId, imageId) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              images: project.images.map((image) =>
                image.id === imageId
                  ? {
                      ...image,
                      type: image.type === "before" ? "after" : "before",
                    }
                  : image,
              ),
            }
          : project,
      ),
    );
  };

  const renderImage = ({ item: image, index }) => (
    <Pressable
      onPress={() => handleImagePress(image.uri)}
      onLongPress={() => toggleImageType(image.projectId, image.id)}
      activeOpacity={0.8}
      className="mr-[3%]"
    >
      <Image
        source={{ uri: image.uri }}
        style={{
          width: scale(150),
          height: verticalScale(160),
          borderRadius: 10,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          top: verticalScale(10),
          left: scale(10),
          width: scale(32),
          height: scale(32),
        }}
        className="absolute bg-[#319FCA] rounded-full items-center justify-center"
      >
        <Ionicons name="camera" size={16} color="white" />
      </View>
    </Pressable>
  );

  const renderProject = ({ item: project }) => (
    <View className="mt-[5%]">
      <Text className="text-base font-poppins-500medium text-[#175994] mb-[3%] px-[4%]">
        {project.title}
      </Text>
      {project.serviceCategory && (
        <Text className="text-sm font-poppins-regular text-gray-600 mb-[2%] px-[4%]">
          {project.serviceCategory}
        </Text>
      )}
      {project.projectDate && (
        <Text className="text-xs font-poppins-regular text-gray-500 mb-[3%] px-[4%]">
          {new Date(project.projectDate).toLocaleDateString()}
        </Text>
      )}
      <FlatList
        data={project.images.map((img) => ({ ...img, projectId: project.id }))}
        renderItem={renderImage}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: scale(16) }}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <CustomTitle title="Project Gallery" withSafeTop={true} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(180) }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && (
          <View className="flex-1 items-center justify-center py-[10%]">
            <ActivityIndicator size="large" color="#319FCA" />
            <Text className="text-gray-500 mt-2">Loading projects...</Text>
          </View>
        )}
        {error && (
          <View className="flex-1 items-center justify-center py-[10%]">
            <Text className="text-red-500">Failed to load projects</Text>
          </View>
        )}
        {!isLoading && !error && (
          <FlatList
            data={projects}
            renderItem={renderProject}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-[10%]">
                <Text className="text-gray-500">No projects yet</Text>
              </View>
            }
          />
        )}
        <AddMoreButton
          onPress={() => router.push("provider/profile/projectGalleryForm")}
        />
      </ScrollView>

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView>
            <Pressable
              onPress={closeImageModal}
              className="absolute top-[2%] right-[4%] z-10"
              style={{
                width: scale(40),
                height: scale(40),
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: scale(20),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
          </SafeAreaView>
          <View className="flex-1 justify-center items-center">
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_HEIGHT,
                }}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProjectGalleryScreen;
