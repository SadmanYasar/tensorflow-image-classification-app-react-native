import { useIsFocused } from "@react-navigation/native";
import { CameraType, Camera } from "expo-camera";
import React, { useState, useRef, useEffect } from "react";
import { Dimensions, Linking, View, StatusBar, Button, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { CameraScreenProps } from "../../types/nav";
import { MaterialIcons } from '@expo/vector-icons';
import styles from "../../theme";

const CameraScreen = ({ route, navigation }: CameraScreenProps) => {
    const insets = useSafeAreaInsets();
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const camera = useRef<Camera>(null);
    const { width } = Dimensions.get('window');
    const isFocused = useIsFocused();

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

    async function takePicture() {
        try {
            if (camera.current) {
                const img = await camera.current.takePictureAsync();
                navigation.navigate('ResutltScreen', { url: img.uri })
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to take picture',
            })
        }
    }

    useEffect(() => {
        if (!permission || !permission?.granted) {
            requestPermission();
        }
    }, [])

    if (!permission || !permission?.granted) {
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
            {isFocused && (
                <>
                    <Camera style={[
                        styles.camera,
                        {
                            maxHeight: calculateHeight(),
                        }
                    ]}
                        type={type}
                        ratio='16:9'
                        ref={camera}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity>
                            <MaterialIcons name="insert-photo" size={32} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takePicture}>
                            <MaterialIcons name="camera" size={48} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleCameraType}>
                            <MaterialIcons name="flip-camera-ios" size={32} color="white" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    )
}

export default CameraScreen;