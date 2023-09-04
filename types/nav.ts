import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
    CameraScreen: undefined;
    ResutltScreen: { url?: string };
}

export type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'CameraScreen'>;
export type ResultSreenProps = NativeStackScreenProps<RootStackParamList, 'ResutltScreen'>;