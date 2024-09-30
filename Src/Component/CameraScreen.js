// CameraScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { PunchContext } from './PunchContext';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { uploadImageToS3 } from '../Api/Api';

const CameraScreen = ({ route, navigation }) => {
  const { punchType } = route.params;
  const { setIsPunchedIn } = useContext(PunchContext);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        let permissionResult;

        if (Platform.OS === 'ios') {
          permissionResult = await request(PERMISSIONS.IOS.CAMERA);
        } else if (Platform.OS === 'android') {
          permissionResult = await request(PERMISSIONS.ANDROID.CAMERA);
        }

        if (permissionResult === RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          Alert.alert('Camera Permission Denied', 'Please enable camera access in your settings.');
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Permission Request Error:', error);
        setHasPermission(false);
      }
    };

    requestPermission();
  }, []);

  const handleCapture = async () => {
    if (hasPermission && this.camera) {
      try {
        const options = { quality: 0.5, base64: false };
        const data = await this.camera.takePictureAsync(options);
        const imageUri = data.uri;
  
        console.log('Captured image URI:', imageUri);
  
        const exists = await RNFS.exists(imageUri);
        if (!exists) {
          Alert.alert('Error', 'Captured image file does not exist.');
          return;
        }
  
        const imageUrl = await uploadImageToS3(imageUri);
  
        if (imageUrl) {
          console.log('Image uploaded successfully:', imageUrl);
          setIsPunchedIn(true);
          navigation.navigate('Confirm', { imageUri: imageUrl, punchType });
        } else {
          console.error('Image upload failed');
          Alert.alert('Error', 'Image upload failed.');
        }
      } catch (error) {
        console.error('Capture Error:', error);
        Alert.alert('Error', 'Failed to capture image.');
      }
    } else {
      Alert.alert('Error', 'Camera not ready or permission denied.');
    }
  };
  
  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
      />
      <Button title={`Capture and Punch ${punchType}`} onPress={handleCapture} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    padding: 20,
  },
  camera: {
    width: '100%',
    height: '80%',
    marginBottom: 20,
  },
});

export default CameraScreen;
