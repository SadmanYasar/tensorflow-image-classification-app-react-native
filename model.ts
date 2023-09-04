import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class Singleton {
    private static instance: Singleton | null = null;
    private model: mobilenet.MobileNet | null = null;

    private constructor() {
        console.log('Singleton constructor called');
    }

    public static async getInstance(): Promise<Singleton> {
        try {
            if (!Singleton.instance) {
                Singleton.instance = new Singleton();
                await Singleton.instance.initializeAsync();
            }
            return Singleton.instance;
        } catch (error) {
            throw new Error('Error initializing model');
        }
    }

    private async initializeAsync() {
        try {
            if (!this.model) {
                console.log('Initializing model');
                await tf.ready();
                this.model = await mobilenet.load();
            }
        } catch (error) {
            throw new Error('Error initializing model');
        }
    }

    public async classifyAsync(image: tf.Tensor3D) {
        try {
            if (!this.model) {
                throw new Error('Model not initialized');
            }
            return await this.model.classify(image);
        } catch (error) {
            throw new Error('Error classifying image');
        }
    }
}

export default Singleton;