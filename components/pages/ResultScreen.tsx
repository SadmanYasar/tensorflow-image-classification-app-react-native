import React from "react";
import { View, StatusBar, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useClassification from "../../hooks/useClassification";
import { ResultSreenProps } from "../../types/nav";
import { MaterialIcons } from '@expo/vector-icons';
import styles from "../../theme"

const ResultScreen = ({ route, navigation }: ResultSreenProps) => {
    const insets = useSafeAreaInsets();
    const { url } = route.params;
    const { isTfReady, result } = useClassification({ url });

    if (!url) {
        navigation.pop(1);
    }

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
            {url && <Image source={{ uri: url }} style={{ flex: 1 }} />}
            <View style={{
                position: 'absolute',
                bottom: 50,
            }}>
                {!isTfReady && <Text style={{ textAlign: 'center', color: 'white', textDecorationColor: 'black', fontSize: 24 }}>Analyzing</Text>}
                {isTfReady && result === '' && <Text style={{ textAlign: 'center', color: 'white', textDecorationColor: 'black', fontSize: 32 }}>Almost There</Text>}
                {result !== '' && <Text style={{ textAlign: 'center', color: 'white', textDecorationColor: 'black', fontSize: 48 }}>{result}</Text>}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.pop(1)}>
                    <MaterialIcons name="arrow-back" size={32} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ResultScreen;