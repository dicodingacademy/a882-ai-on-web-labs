import * as tf from '@tensorflow/tfjs';

export default class AppModel {
  async loadModel() {
    const modelUrl = './model/model.json';
    const metadataUrl = './model/metadata.json';

    const [model, metadata] = await Promise.all([
      tf.loadLayersModel(modelUrl),
      fetch(metadataUrl).then((res) => res.json()),
    ]);

    return { model, metadata };
  }
}
