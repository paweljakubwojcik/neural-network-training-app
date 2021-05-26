import * as tf from '@tensorflow/tfjs'
import { Tensor } from '@tensorflow/tfjs'

export default function normalizeTensor(normalizedTensor: Tensor, Min: Tensor, Max: Tensor) {
    return tf.tidy(() => {
        return normalizedTensor.mul(Max.sub(Min)).add(Min)
    })
}
