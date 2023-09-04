import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

type RootStackParamList = {
  CameraScreen: undefined;
}

const CameraScreen = () => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  async function openSettings() {
    try {
      await Linking.openSettings();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to open settings',
      })
    }
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  useEffect(() => {
    if (!permission || !permission?.granted) {
      requestPermission();
    }
  }, [])

  if (!permission || !permission?.granted) {
    return (
      <View
        style={styles.container}>
        <Button title="Request permission" onPress={() => openSettings()} />
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ratio='16:9'>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  )
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState('');
  const image = useRef(null);
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState<any>(null)

  const load = async () => {
    try {
      // Load mobilenet.
      await tf.ready();
      const model = await mobilenet.load();
      setIsTfReady(true);

      // Start inference and show result.
      const image = require('./basketball.jpg');
      const imageAssetPath = Image.resolveAssetSource(image);
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
      const imageDataArrayBuffer = await response.arrayBuffer();
      const imageData = new Uint8Array(imageDataArrayBuffer);
      const imageTensor = decodeJpeg(imageData);
      const prediction = await model.classify(imageTensor);
      if (prediction && prediction.length > 0) {
        setResult(
          `${prediction[0].className} (${prediction[0].probability.toFixed(3)})`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   load();
  // }, []);

  // return (
  //   <View
  //     style={{
  //       height: '100%',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //     }}
  //   >
  //     <Image
  //       ref={image}
  //       source={require('./basketball.jpg')}
  //       style={{ width: 200, height: 200 }}
  //     />
  //     {!isTfReady && <Text>Loading TFJS model...</Text>}
  //     {isTfReady && result === '' && <Text>Classifying...</Text>}
  //     {result !== '' && <Text>{result}</Text>}
  //   </View>
  // );

  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='CameraScreen'>
          <RootStack.Screen name='CameraScreen' component={CameraScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
      <Toast />
    </>
  )

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center'
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
});

export default App;
