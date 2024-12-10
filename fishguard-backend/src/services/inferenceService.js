import { InputError } from '../exceptions/InputError.js';
import tf from '@tensorflow/tfjs-node';

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const resultScore = Math.max(...score) * 100;
    const result = resultScore > 50 ? 'Ikan-Dilindungi' : 'Tidak-Lindungi';

    const suggestion =
      result === 'Ikan-Lindungi' ? 'Segera lepaskan ikan tersebut!' : 'Spesies Ikan aman di tangkap';

    return { resultScore, result, suggestion };
  } catch (error) {
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

export default predictClassification;