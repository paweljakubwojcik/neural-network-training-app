import * as tf from '@tensorflow/tfjs'
import { Tensor } from '@tensorflow/tfjs'

export default function normalizeTensor(tensor: Tensor) {
    return tf.tidy(() => {
        const Max = tensor.max()
        const Min = tensor.min()

        const normalizedTensor = tensor.sub(Min).div(Max.sub(Min))

        return {
            normalizedTensor,
            Min,
            Max,
        }
    })
}
