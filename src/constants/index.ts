import { losses, metrics } from '@tensorflow/tfjs'

export const MIN_UNITS = 1
export const MAX_UNITS = 8

export const MAX_LAYERS = 5
export const MIN_LAYERS = 2

export const ACTIVATION_IDENTIFIRES = [
    'linear',
    'relu',
    'elu',
    'hardSigmoid',
    'relu6',
    'selu',
    'sigmoid',
    'softmax',
    'softplus',
    'softsign',
    'tanh',
    'swish',
    'mish',
] as const

export const LOSSES_FUNCTIONS = Object.keys(losses) as (keyof typeof losses)[]
export const METRICS = Object.keys(metrics) as (keyof typeof metrics)[]
