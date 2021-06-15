import { Optimizer, train } from '@tensorflow/tfjs'

export type optimizerInfo = {
    name: string
    constructor: (...params: any) => Optimizer
    parameters: {
        name: string
        defaultValue: any
        type: 'number' | 'boolean'
        description?: string
    }[]
    description?: string
}

type optimizersList = {
    [key: string]: optimizerInfo
}

//NOTE: Parameters must be in the same order as in constructor function

export const OPTIMIZERS: optimizersList = {
    sgd: {
        name: 'sgd',
        constructor: train.sgd,
        parameters: [
            {
                name: 'learningRate',
                type: 'number',
                defaultValue: 0.001,
                description: 'The learning rate to use for the algorithm. ',
            },
        ],
        description: 'Optimizer that uses stochastic gradient descent',
    },
    momentum: {
        name: 'momentum',
        constructor: train.momentum,
        parameters: [
            {
                name: 'learningRate',
                type: 'number',
                defaultValue: 0.001,
                description: 'The learning rate to use for the algorithm. ',
            },
            {
                name: 'momentum',
                type: 'number',
                defaultValue: 0.001,
                description: 'The momentum to use for the momentum gradient descent algorithm.',
            },
            {
                name: 'useNesterov',
                type: 'boolean',
                defaultValue: false,
            },
        ],
        description: 'Optimizer that uses momentum gradient descent.',
    },
    adam: {
        name: 'adam',
        constructor: train.adam,
        parameters: [
            {
                name: 'learningRate',
                type: 'number',
                defaultValue: 0.001,
            },
            {
                name: 'beta1',
                type: 'number',
                defaultValue: 0.9,
                description: 'The exponential decay rate for the 1st moment estimates',
            },
            {
                name: 'beta2',
                type: 'number',
                defaultValue: 0.999,
                description: 'The exponential decay rate for the 2nd moment estimates',
            },
            {
                name: 'epsilon',
                type: 'number',
                defaultValue: null,
                description: 'A small constant for numerical stability',
            },
        ],
        description: 'Optimizer that uses the Adam algorithm. See https://arxiv.org/abs/1412.6980',
    },
    rmsprop: {
        name: 'rmsprop',
        constructor: train.rmsprop,
        parameters: [
            {
                name: 'learningRate',
                type: 'number',
                defaultValue: 0.001,
            },
            {
                name: 'decay',
                type: 'number',
                defaultValue: 0.9,
                description: 'The discounting factor for the history/coming gradient',
            },
            {
                name: 'momentum',
                type: 'number',
                defaultValue: 0.999,
                description: 'The momentum to use for the RMSProp gradient descent algorithm',
            },
            {
                name: 'epsilon',
                type: 'number',
                defaultValue: null,
                description: 'Small value to avoid zero denominator',
            },
            {
                name: 'centered',
                type: 'boolean',
                defaultValue: false,
                description:
                    'If true, gradients are normalized by the estimated variance of the gradient',
            },
        ],
        description:
            'Constructs a tf.RMSPropOptimizer that uses RMSProp gradient descent. This implementation uses plain momentum and is not centered version of RMSProp.',
    },
    /* adadelta: 
    adagrad: 
    adamax:  */
}
