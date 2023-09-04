import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import ResultScreen from './components/pages/ResultScreen';
import CameraScreen from './components/pages/CameraScreen';

type RootStackParamList = {
  CameraScreen: undefined;
  ResutltScreen: { url?: string };
}

const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName='CameraScreen' screenOptions={{ headerShown: false, headerBackVisible: false }}>
          <RootStack.Screen name='CameraScreen' component={CameraScreen} />
          <RootStack.Screen name='ResutltScreen' component={ResultScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  )
};

export default App;
