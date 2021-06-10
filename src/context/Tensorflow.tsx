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

import getParamNames from '../util/getParamNames'
import unNormalizeTensor from '../util/unNormalizeTensor'

import {
    MIN_UNITS,
    MAX_UNITS,
    MAX_LAYERS,
    MIN_LAYERS,
    ACTIVATION_IDENTIFIRES,
    METRICS,
    LOSSES_FUNCTIONS,
} from '../constants'

import { Optimizer, Sequential, train } from '@tensorflow/tfjs'
import type { ScatterDataPoint } from 'chart.js'
import { useData } from './Data'
import normalizeTensor from '../util/normalizeTensor'

type ActivationIdentifier = typeof ACTIVATION_IDENTIFIRES[number]
type OptimizerType = keyof typeof train
type LossesType = typeof LOSSES_FUNCTIONS[number]
type MetricType = typeof METRICS[number]

type OptimizerConstructor = (...params: any) => Optimizer

export interface ModelSettings {
    layers: {
        name: string
        units: number
        activation?: ActivationIdentifier
        adjustable: boolean
    }[]
    optimizer: OptimizerConstructor
    optimizerOptions: any
    loss: LossesType
    metric: MetricType
}
export interface LearningSettings {
    batchSize: number
    epochs: number
    normalize: boolean
}

const defaultOptimizerOptions: {
    [key: string]: number | boolean
} = {
    learningRate: 0.001,
    momentum: 1,
}

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
            adjustable: true,
            activation: 'linear',
        },
    ],
    optimizer: train.sgd as unknown as OptimizerConstructor,
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

//TODO: model settings into it's own context, or reducer

const TensorflowContext = createContext({
    trainingLogs: [] as ScatterDataPoint[],
    trainingValLogs: [] as ScatterDataPoint[],
    trainingEffects: [] as { [key: string]: number }[],
    modelSettings: initialModelSettings,
    learningSettings: initialLearningSettings,
    isCompiled: false,
    isTraining: false,
    trainModel: async () => {},
    evaulateData: async (data: number[]) => new Promise((res) => res([])),
    compileModel: () => {},
    setLayersUnits: (layerName: string, newValue: number) => {},
    addLayer: () => {},
    removeLayer: () => {},
    setActivationFunction: (layerName: string, newValue: ActivationIdentifier) => {},
    stopTraining: () => {},
    setLearningOption: (option: { [k in keyof LearningSettings]?: LearningSettings[k] }) => {},
    setOptimizer: (newOptimazer: OptimizerType) => {},
    setOptimizerOption: (key: string, newValue: any) => {},
    setLoss: (newValue: LossesType) => {},
    setMetric: (newValue: MetricType) => {},
})

function TensorflowProvider({ children }: { children: ReactNode }) {
    const { learningData } = useData()

    const [trainingLogs, setTrainingLogs] = useState<ScatterDataPoint[]>([])
    const [trainingValLogs, setTrainingValLogs] = useState<ScatterDataPoint[]>([])
    const [trainingEffects, setTrainingEffects] = useState<{ [key: string]: number }[]>([])

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

    const setOptimizer = (newOptimizer: OptimizerType) => {
        const optimizer = train[newOptimizer] as OptimizerConstructor
        const optimizerOptions: {
            [k: string]: number | undefined | boolean
        } = Object.fromEntries(
            getParamNames(optimizer).map(({ key, type, defaulValue: value }) => {
                let defaultValue
                if (!value) defaultValue = defaultOptimizerOptions[key]
                else {
                    if (type === 'boolean') defaultValue = value === 'true'
                    if (type === 'number') defaultValue = parseFloat(value!)
                }

                return [key, defaultValue]
            })
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
                    inputShape: index === 0 ? [1] : undefined,
                    units,
                    activation,
                    /*  useBias: false, */
                })
            ),
        })

        model.current.compile({
            optimizer: optimizer(...Object.values(optimizerOptions)),
            loss: tf.losses[loss] as any, // taka fcn jest w instrukcji
            metrics: tf.metrics[metric],
        })
        setTrainingLogs([])
        setTrainingValLogs([])
        setCompiled(true)
        console.log('%cModel compiled succesfully', 'font-weight: bold; font-size: 16px;')
        model.current.summary()
    }, [isTraining, modelSettings, stopTraining])

    const trainModel = useCallback(async () => {
        const { epochs, batchSize, normalize } = learningSettings

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

        const testVector = tf.linspace(MAX_TEST, MIN_TEST, GRAIN_LEVEL)

        setTraining(true)
        try {
            await model.current.fit(learningInput, learningLabels, {
                batchSize,
                epochs,
                initialEpoch: trainingLogs.length,
                shuffle: true,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        setTrainingLogs((prev) => [
                            ...prev,
                            { x: epoch, y: logs ? logs[modelSettings.metric] : 0 },
                        ])
                        setTrainingValLogs((prev) => [
                            ...prev,
                            { x: epoch, y: logs ? logs[`val_${modelSettings.metric}`] : 0 },
                        ])
                        console.log(logs)
                        let predictedTensor = model.current.predict(testVector) as tf.Tensor

                        if (normalize)
                            predictedTensor = unNormalizeTensor(predictedTensor, labelMin, labelMax)

                        //TODO: remmember to set this to {input_1: value, input_2: value, label_1: value}[]
                        setTrainingEffects(() => {
                            const predictedArray = predictedTensor.arraySync() as number[]
                            const testArray = normalize
                                ? (unNormalizeTensor(
                                      testVector,
                                      inputMin,
                                      inputMax
                                  ).arraySync() as number[])
                                : testVector.arraySync()
                            return predictedArray.map((y, i) => ({
                                [labelKeys[0]]: y,
                                [inputKeys[0]]: testArray[i],
                            }))
                        })
                        /* console.log(logs) */
                        // when fullfilling the training goal
                        /* if (trainingGoal) {
                        model.stopTraining = true
                    } */
                    },
                },
            })
        } catch (e) {
            throw e
        } finally {
            setTraining(false)
        }
    }, [learningData, learningSettings, modelSettings.metric, trainingLogs.length])

    /**
     * TODO: implement proper evaulation
     * @returns evaulation results
     */
    const evaulateData = async () => {
        return [{ x: 0, y: 0 }]
    }

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

    return (
        <TensorflowContext.Provider
            value={{
                trainingLogs,
                trainingValLogs,
                trainingEffects,
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
