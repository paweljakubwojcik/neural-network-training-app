import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
    useContext,
} from 'react'
import * as tf from '@tensorflow/tfjs'

import unNormalizeTensor from '../util/unNormalizeTensor'

import {
    MIN_UNITS,
    MAX_UNITS,
    MAX_LAYERS,
    MIN_LAYERS,
    ACTIVATION_IDENTIFIRES,
    METRICS,
    LOSSES_FUNCTIONS,
    OPTIMIZERS,
    optimizerInfo,
} from '../constants'

import { Sequential } from '@tensorflow/tfjs'
import { useData } from './Data'
import normalizeTensor from '../util/normalizeTensor'

type ActivationIdentifier = typeof ACTIVATION_IDENTIFIRES[number]
type LossesType = typeof LOSSES_FUNCTIONS[number]
type MetricType = typeof METRICS[number]

export interface ModelSettings {
    layers: {
        name: string
        units: number
        activation?: ActivationIdentifier
        adjustable: boolean
    }[]
    optimizer: optimizerInfo
    optimizerOptions: any
    loss: LossesType
    metric: MetricType
}
export interface LearningSettings {
    batchSize: number
    epochs: number
    normalize: boolean
}

type evaluationResults = {
    evaluation: number[]
    prediction: { [key: string]: number }[]
    error: { [key: string]: number }[]
}

/**
 * @argument currentTrainingLog - object containing metric loss and validation error from current epoch
 * @argument currentPrediction - vector with current prediction
 */
export type onEpochEndCallback = (
    currentTrainingLog: {
        metric: { [key: string]: number }
        val: { [key: string]: number }
    },
    currentPrediction: { [key: string]: number }[]
) => void

type trainModelFunction = (args: {
    onEpochEndCallback: onEpochEndCallback
    onTrainBeginCallback: () => void
}) => Promise<void>

const initialModelSettings: ModelSettings = {
    layers: [
        {
            name: 'Input Layer',
            units: 1,
            activation: 'linear',
            adjustable: false,
        },
        {
            name: 'Hidden Layer 1',
            units: 4,
            activation: 'linear',
            adjustable: true,
        },
        {
            name: 'Output Layer',
            units: 1,
            adjustable: false,
            activation: 'linear',
        },
    ],
    optimizer: OPTIMIZERS.sgd,
    optimizerOptions: {
        learningRate: 0.001,
    },
    loss: 'meanSquaredError',
    metric: 'meanSquaredError',
}

const initialLearningSettings: LearningSettings = {
    batchSize: 32,
    epochs: 100,
    normalize: true,
}

const TensorflowContext = createContext({
    modelSettings: initialModelSettings,
    learningSettings: initialLearningSettings,
    isCompiled: false,
    isTraining: false,
    trainModel: (async () => {}) as trainModelFunction,
    evaulateData: (): evaluationResults => ({} as evaluationResults),
    compileModel: () => {},
    setLayersUnits: (layerName: string, newValue: number) => {},
    addLayer: () => {},
    removeLayer: () => {},
    setActivationFunction: (layerName: string, newValue: ActivationIdentifier) => {},
    stopTraining: () => {},
    setLearningOption: (option: { [k in keyof LearningSettings]?: LearningSettings[k] }) => {},
    setOptimizer: (newOptimazer: string) => {},
    setOptimizerOption: (key: string, newValue: any) => {},
    setLoss: (newValue: LossesType) => {},
    setMetric: (newValue: MetricType) => {},
})

function TensorflowProvider({ children }: { children: ReactNode }) {
    const { learningData, evaluationData } = useData()

    const model = useRef<Sequential>(tf.sequential())

    const [isCompiled, setCompiled] = useState(false)
    const [isTraining, setTraining] = useState(false)

    // possibly change it to hook
    const [modelSettings, setModelSettings] = useState(initialModelSettings)
    const [learningSettings, setLearningSettings] = useState(initialLearningSettings)

    // when any setting is change model needs to be compiled again
    useEffect(() => {
        setCompiled(false)
    }, [modelSettings])

    const setLayersUnits = useCallback((layerName: string, newValue: number) => {
        setModelSettings((state) => {
            const layerToChange = state.layers.find((layer) => layer.name === layerName)!
            if (newValue > MAX_UNITS || newValue < MIN_UNITS) return state
            layerToChange.units = newValue
            return { ...state }
        })
    }, [])

    useEffect(() => {
        setLayersUnits('Input Layer', learningData.inputs.keys.length)
        setLayersUnits('Output Layer', learningData.labels.keys.length)
    }, [learningData.inputs.keys.length, learningData.labels.keys.length, setLayersUnits])

    const addLayer = useCallback(() => {
        setModelSettings((state) => {
            if (state.layers.length >= MAX_LAYERS) return state
            state.layers.splice(-1, 0, {
                name: `Hidden Layer ${state.layers.length - 1}`,
                units: 1,
                activation: 'linear',
                adjustable: true,
            })
            return { ...state }
        })
    }, [])

    const removeLayer = useCallback(() => {
        setModelSettings((state) => {
            if (state.layers.length <= MIN_LAYERS) return state
            state.layers.splice(-2, 1)
            return { ...state }
        })
    }, [])

    const setActivationFunction = (layerName: string, newValue: ActivationIdentifier) => {
        setModelSettings((state) => {
            const layerToChange = state.layers.find((layer) => layer.name === layerName)!
            layerToChange.activation = newValue
            return { ...state }
        })
    }

    const setOptimizer = (newOptimizer: string) => {
        const optimizer = OPTIMIZERS[newOptimizer]
        const optimizerOptions: {
            [k: string]: number | undefined | boolean
        } = Object.fromEntries(
            optimizer.parameters.map(({ name, defaultValue }) => [name, defaultValue])
        )

        setModelSettings((state) => ({
            ...state,
            optimizer,
            optimizerOptions,
        }))
    }

    const stopTraining = useCallback(() => {
        model.current.stopTraining = true
        setTraining(false)
    }, [model])

    const compileModel = useCallback(async () => {
        const { layers, optimizer, optimizerOptions, loss, metric } = modelSettings

        if (isTraining) stopTraining()

        model.current = tf.sequential({
            layers: layers.map(({ units, activation }, index) =>
                tf.layers.dense({
                    inputShape: index === 0 ? [units] : undefined,
                    units,
                    activation,
                    /*  useBias: false, */
                })
            ),
        })

        model.current.compile({
            optimizer: optimizer.constructor(...Object.values(optimizerOptions)),
            loss: tf.losses[loss] as any,
            metrics: tf.metrics[metric],
        })

        setCompiled(true)
        console.log('%cModel compiled succesfully', 'font-weight: bold; font-size: 16px;')
        model.current.summary()
    }, [isTraining, modelSettings, stopTraining])

    /**
     * handles the normalization (if active), then calls a model.fit() with input and output specyfied in arguments
     * calls onEpochEndsCallback on every epoch end to enable actualizing logs
     */
    const trainModel: trainModelFunction = useCallback(
        async ({ onEpochEndCallback, onTrainBeginCallback }) => {
            const { epochs, batchSize, normalize } = learningSettings

            //TODO: clean up normalization

            let learningInput = learningData.inputs.asTensor,
                learningLabels = learningData.labels.asTensor,
                labelMin: tf.Tensor,
                labelMax: tf.Tensor,
                inputMin: tf.Tensor,
                inputMax: tf.Tensor

            const inputKeys = learningData.inputs.keys
            const labelKeys = learningData.labels.keys

            if (normalize) {
                const input = normalizeTensor(learningInput)
                learningInput = input.normalizedTensor
                inputMin = input.Min
                inputMax = input.Max

                const label = normalizeTensor(learningLabels)
                learningLabels = label.normalizedTensor
                labelMin = label.Min
                labelMax = label.Max
            }

            learningInput.print()
            learningLabels.print()

            const GRAIN_LEVEL = 20
            const MAX_TEST = learningInput.max().arraySync() as number
            const MIN_TEST = learningInput.min().arraySync() as number

            learningInput.min().print()

            const testVector = tf
                .tensor(
                    inputKeys.map((k) => tf.linspace(MAX_TEST, MIN_TEST, GRAIN_LEVEL).arraySync())
                )
                .reshape([-1, inputKeys.length])

            setTraining(true)
            try {
                await model.current.fit(
                    learningInput.reshape([-1, inputKeys.length]),
                    learningLabels.reshape([-1, labelKeys.length]),
                    {
                        batchSize,
                        epochs,
                        shuffle: true,
                        validationSplit: 0.2,
                        yieldEvery: 50,
                        callbacks: {
                            onTrainBegin: onTrainBeginCallback,
                            onEpochEnd: async (epoch, logs) => {
                                // object containing metric loss and validation loss for current epoch

                                // because tensorflow uses hashed names for metrics like 'mse' => 'Hf' , so we have to find that name
                                const currentMetricName = logs
                                    ? Object.keys(logs).find(
                                          (name) => !name.includes('loss') && !name.includes('val')
                                      )
                                    : 'loss'

                                const currentTrainingLog = {
                                    metric: { x: epoch, y: logs ? logs[`${currentMetricName}`] : 0 },
                                    val: {
                                        x: epoch,
                                        y: logs ? logs[`val_${currentMetricName}`] : 0,
                                    },
                                }

                                console.log(logs)
                                let predictedTensor = model.current.predict(testVector) as tf.Tensor

                                if (normalize)
                                    predictedTensor = unNormalizeTensor(
                                        predictedTensor,
                                        labelMin,
                                        labelMax
                                    )
                                const predictedArray = predictedTensor.arraySync() as number[][]

                                const testArray = normalize
                                    ? (unNormalizeTensor(
                                          testVector,
                                          inputMin,
                                          inputMax
                                      ).arraySync() as number[][])
                                    : (testVector.arraySync() as number[][])

                                // [[x, y],[x,y]],[[z],[z]] => [{x,y,z},{x,y,z}]
                                const currentPrediction = predictedArray.map((y, j) =>
                                    Object.fromEntries([
                                        ...labelKeys.map((key, i) => [key, y[i]]),
                                        ...inputKeys.map((key, i) => [key, testArray[j][i]]),
                                    ])
                                )

                               /*  console.log(currentPrediction) */

                                onEpochEndCallback(currentTrainingLog, currentPrediction)
                                /* console.log(logs) */
                                // when fullfilling the training goal
                                /* if (trainingGoal) {
                        model.stopTraining = true
                    } */
                            },
                        },
                    }
                )
            } catch (e) {
                throw e
            } finally {
                setTraining(false)
            }
        },
        [learningData, learningSettings, modelSettings.metric]
    )

    const evaulateData = useCallback(() => {
        const { inputs, labels } = evaluationData
        const { normalize } = learningSettings

        // handle normalization
        let learningInput = inputs.asTensor,
            learningLabels = labels.asTensor,
            labelMin: tf.Tensor,
            labelMax: tf.Tensor,
            inputMin: tf.Tensor,
            inputMax: tf.Tensor

        if (normalize) {
            const input = normalizeTensor(learningInput)
            learningInput = input.normalizedTensor
            inputMin = input.Min
            inputMax = input.Max

            const label = normalizeTensor(learningLabels)
            learningLabels = label.normalizedTensor
            labelMin = label.Min
            labelMax = label.Max
        }

        // 1.evaulate ( get total loss and metric )

        const testInput = learningInput.reshape([-1, inputs.keys.length])
        const testLabels = learningLabels.reshape([-1, labels.keys.length])

        const evaluation = (model.current.evaluate(testInput, testLabels) as tf.Scalar[]).map(
            (tensor) => tensor.arraySync()
        )

        // 2.get final prediction

        let finalPrediction = model.current.predict(testInput) as tf.Tensor

        let errorTensor = finalPrediction.sub(testLabels)

        if (normalize) finalPrediction = unNormalizeTensor(finalPrediction, labelMin!, labelMax!)
        if (normalize) errorTensor = unNormalizeTensor(errorTensor, labelMin!, labelMax!)

        const testArray = normalize
            ? (unNormalizeTensor(testInput, inputMin!, inputMax!).arraySync() as number[][])
            : (testInput.arraySync() as number[][])

        // [[x, y],[x,y]],[[z],[z]] => [{x,y,z},{x,y,z}]
        const prediction = (finalPrediction.arraySync() as number[][]).map((y, j) =>
            Object.fromEntries([
                ...labels.keys.map((key, i) => [key, y[i]]),
                ...inputs.keys.map((key, i) => [key, testArray[j][i]]),
            ])
        )
        const error = (errorTensor.arraySync() as number[][]).map((y, j) =>
            Object.fromEntries([
                ...labels.keys.map((key, i) => [key, y[i]]),
                ...inputs.keys.map((key, i) => [key, testArray[j][i]]),
            ])
        )

        return { evaluation, prediction, error }
    }, [evaluationData, learningSettings])

    const setLearningOption = (
        options: { [k in keyof LearningSettings]?: LearningSettings[k] }
    ) => {
        setLearningSettings((prev) => ({ ...prev, ...options }))
    }

    const setOptimizerOption = (key: any, newValue: any) => {
        if (isNaN(newValue)) newValue = undefined

        setModelSettings((prev) => {
            const newState = {
                ...prev,
                optimizerOptions: { ...prev.optimizerOptions, [key]: newValue },
            }
            console.log(newState)
            return newState
        })
    }

    const setLoss = (newValue: LossesType) => {
        setModelSettings((prev) => {
            return { ...prev, loss: newValue }
        })
    }
    const setMetric = (newValue: MetricType) => {
        setModelSettings((prev) => {
            return { ...prev, metric: newValue }
        })
    }
    // move logs into new context and use useState for context

    return (
        <TensorflowContext.Provider
            value={{
                modelSettings,
                learningSettings,
                isCompiled,
                isTraining,
                trainModel,
                evaulateData,
                compileModel,
                setLayersUnits,
                addLayer,
                removeLayer,
                setActivationFunction,
                stopTraining,
                setLearningOption,
                setOptimizer,
                setOptimizerOption,
                setLoss,
                setMetric,
            }}
        >
            {children}
        </TensorflowContext.Provider>
    )
}

const useTensorflow = () => useContext(TensorflowContext)

export { TensorflowContext, TensorflowProvider, useTensorflow }
