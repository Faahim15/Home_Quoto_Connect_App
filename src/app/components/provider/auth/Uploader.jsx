import { View } from "react-native";
import ServiceDocumentUpload from "../home/DoucumentUpload";
import LicenceHeader from "./LicenceHeader";

export default function Uploader({
  title,
  subtitle,
  selectedFile,
  onFileSelect,
}) {
  return (
    <View className="mt-[8%]">
      <LicenceHeader title={title} subtitle={subtitle} />
      <ServiceDocumentUpload
        content="Click to upload"
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
      />
    </View>
  );
}
