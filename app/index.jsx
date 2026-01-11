import { View } from "react-native";
import OpenCameraButton from "./components/OpenCameraButton";
import UploadImageButton from "./components/UploadImageButton";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OpenCameraButton
        title="Open Camera"
      />
      <UploadImageButton
        title="Upload Image"
      />
    </View>
  );
}
