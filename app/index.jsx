import { View } from "react-native";
import CaptureImageAndAnalyse from "./components/CaptureImageAndAnalyse";
import UploadImageAndAnalyse from "./components/UploadImageAndAnalyse";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CaptureImageAndAnalyse
        title="Open Camera"
      />
      <UploadImageAndAnalyse
        title="Upload Image"
      />
    </View>
  );
}
