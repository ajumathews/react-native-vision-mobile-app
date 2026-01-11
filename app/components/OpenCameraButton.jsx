
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { analyzeImageWithVision } from '../services/visionService';

const OpenCameraButton = ({ title = 'Open Camera' }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef(null);
  const router = useRouter();

  const openCamera = async () => {
    if (!permission) {
      // Still loading permissions
      return;
    }
    
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }
    setModalVisible(true);
  };

  const closeCamera = () => {
    setModalVisible(false);
  };

  const analyzeImage = async (imageUri) => {
    try {
      setAnalyzing(true);
      
      const extractedText = await analyzeImageWithVision(imageUri);
      
      // Close camera modal
      setModalVisible(false);
      
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
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo.uri);
        
        // Analyze the image with AI
        await analyzeImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  return (
    <View style={{ margin: 20 }}>
      <Button title={title} onPress={openCamera} />
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeCamera}
      >
        <View style={styles.cameraContainer}>
          {!permission ? (
            <View><Button title="Loading..." onPress={closeCamera} /></View>
          ) : !permission.granted ? (
            <View><Button title="Request Permission" onPress={openCamera} /></View>
          ) : (
            <>
              <CameraView ref={cameraRef} style={styles.camera} facing="back" />
              <View style={styles.controls}>
                <TouchableOpacity 
                  style={styles.captureButton} 
                  onPress={takePicture}
                  disabled={analyzing}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              
              {analyzing && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingText}>Analyzing image...</Text>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default OpenCameraButton;
