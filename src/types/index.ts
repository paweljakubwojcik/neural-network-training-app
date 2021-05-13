import type { Optimizer, ModelCompileArgs } from '@tensorflow/tfjs'

export interface ModelSettings {
    layers: [
        {
            name: string
            units: number
            activationFunc: string
            adjustable: boolean
        }
    ]
    optimizer: (optimizerOptions: any) => Optimizer
    optimazerOptions: any
    loss: ModelCompileArgs['loss']
}

export type ReducerAction = {
    type: string
    payload: any
}
