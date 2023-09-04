import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Linking, Alert, StatusBar, Dimensions } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { MaterialIcons } from '@expo/vector-icons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type RootStackParamList = {
  CameraScreen: undefined;
  Screen2: undefined;
}

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraScreen'>;
type Screen2Props = NativeStackScreenProps<RootStackParamList, 'Screen2'>;

const Screen2 = ({ route, navigation }: Screen2Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'black',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <StatusBar barStyle="light-content" animated />
      <Button title="Camera" onPress={() => navigation.navigate('CameraScreen')} />
    </View>
  )
}

const CameraScreen = ({ route, navigation }: CameraScreenProps) => {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imagePadding, setImagePadding] = useState(0);
  const { height, width } = Dimensions.get('window');

  function calculateHeight() {
    return width * 16 / 9;
  }

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
      </View>
    )
  }

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: 'black',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      },
    ]}>
      <StatusBar barStyle="light-content" animated />
      <Camera style={[
        styles.camera,
        {
          maxHeight: calculateHeight(),
        }
      ]} type={type} ratio='16:9' />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Screen2')}>
          <MaterialIcons name="insert-photo" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="camera" size={48} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCameraType}>
          <MaterialIcons name="flip-camera-ios" size={32} color="white" />
        </TouchableOpacity>
      </View>
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
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='Screen2' screenOptions={{ headerShown: false, headerBackVisible: false }}>
          <RootStack.Screen name='CameraScreen' component={CameraScreen} />
          <RootStack.Screen name='Screen2' component={Screen2} />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  )

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
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
