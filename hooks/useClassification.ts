import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import Model from "../model";
import * as FileSystem from 'expo-file-system';

interface Classification {
    url: string | undefined;
}

const useClassification = ({ url = '' }: Classification) => {
    const [isTfReady, setIsTfReady] = useState(false);
    const [result, setResult] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const instance = await Model.getInstance();

                setIsTfReady(true);


                const response = await FileSystem.readAsStringAsync(url, { encoding: FileSystem.EncodingType.Base64 });
                const imageData = new Uint8Array(Buffer.from(response, 'base64'));
                const imageTensor = decodeJpeg(imageData);

                const prediction = await instance.classifyAsync(imageTensor);

                if (prediction && prediction.length > 0) {
                    setResult(
                        `${Math.round(Number(prediction[0].probability * 100))}% ${prediction[0].className}`
                    );
                }
            } catch (error) {

                Toast.show({
                    type: 'error',
                    text1: 'Please try again',
                })
            }
        }

        load();
    }, []);

    return { isTfReady, result };
}

export default useClassification;