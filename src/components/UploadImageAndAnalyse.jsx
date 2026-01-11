import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, View } from "react-native";
import { analyzeImageWithVision } from '../services/visionService';

const UploadImageAndAnalyse = ({title = 'Upload Image'}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();
  const handleUpload = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log('Selected image:', imageUri);
      
      // Analyze the image with AI
      try {
        setAnalyzing(true);
        
        const extractedText = await analyzeImageWithVision(imageUri);
        
        // Navigate to results page
        router.push({
          pathname: '/results',
          params: { result: extractedText }
        });
      } catch (error) {
        console.error('Error analyzing image:', error);
        Alert.alert('Error', `Failed to analyze image: ${error.message}`);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  return (
    <View style={{margin: 20}}>
      <Button title={title} onPress={handleUpload} disabled={analyzing} />
      {analyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" style={{marginTop: 10}} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
  },
});

export default UploadImageAndAnalyse;
