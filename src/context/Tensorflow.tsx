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

import { trainX, trainY } from '../util/MockData'
import getParamNames from '../util/getParamNames'

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

type ActivationIdentifier = typeof ACTIVATION_IDENTIFIRES[number]
type OptimizerType = keyof typeof train
type LossesType = typeof LOSSES_FUNCTIONS[number]
type MetricType = typeof METRICS[number]

type OptimizerConstructor = (...params: any) => Optimizer

export interface ModelSettings {
    layers: {
        name: string
        units: number
        activation: ActivationIdentifier | undefined
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
            units: 2,
            activation: 'linear',
            adjustable: true,
        },
        {
            name: 'Output Layer',
            units: 1,
            activation: 'linear',
            adjustable: true,
        },
    ],
    optimizer: train.sgd as unknown as OptimizerConstructor,
    optimizerOptions: {
        learningRate: 0.001,
    },
    loss: 'meanSquaredError',
    metric: 'meanAbsoluteError',
}

const initialLearningSettings: LearningSettings = {
    batchSize: 128,
    epochs: 100,
}

//TODO: define data interfaces or types
//TODO: model settings into it's own context, or reducer

type TensorflowContextType = {
    trainingLogs: ScatterDataPoint[]
    modelSettings: ModelSettings
    learningSettings: LearningSettings
    isCompiled: boolean
    isTraining: boolean
    trainModel: () => Promise<void>
    evaulateData: (data: number[]) => Promise<ScatterDataPoint[]>
    compileModel: () => void
    incrementLayerUnits: (layerName: string) => void
    decrementLayerUnits: (layerName: string) => void
    addLayer: () => void
    removeLayer: () => void
    setActivationFunction: (layerName: string, newValue: ActivationIdentifier) => void
    stopTraining: () => void
    setBatchSize: (batchSize: number) => void
    setEpochsNumber: (epochs: number) => void
    setOptimizer: (newOptimazer: OptimizerType) => void
    setOptimizerOption: (key: string, newValue: any) => void
    setLoss: (newValue: LossesType) => void
    setMetric: (newValue: MetricType) => void
}

const TensorflowContext = createContext<TensorflowContextType>({
    trainingLogs: [],
    modelSettings: initialModelSettings,
    learningSettings: initialLearningSettings,
    isCompiled: false,
    isTraining: false,
    trainModel: async () => {},
    evaulateData: async (data: number[]) => new Promise((res) => res([])),
    compileModel: () => {},
    incrementLayerUnits: (layerName: string) => {},
    decrementLayerUnits: (layerName: string) => {},
    addLayer: () => {},
    removeLayer: () => {},
    setActivationFunction: (layerName: string, newValue: ActivationIdentifier) => {},
    stopTraining: () => {},
    setBatchSize: (batchSize: number) => {},
    setEpochsNumber: (epochs: number) => {},
    setOptimizer: (newOptimazer: OptimizerType) => {},
    setOptimizerOption: (key: string, newValue: any) => {},
    setLoss: (newValue: LossesType) => {},
    setMetric: (newValue: MetricType) => {},
})

function TensorflowProvider({ children }: { children: ReactNode }) {
    const [trainingLogs, setTrainingLogs] = useState<ScatterDataPoint[]>([]) // FIXME: this doesn't make sense now,

    const model = useRef<Sequential>(tf.sequential())

    const [isCompiled, setCompiled] = useState(false)
    const [isTraining, setTraining] = useState(false)

    // possibly change it to hook
    const [state, setState] = useState(initialModelSettings)
    const [learningSettings, setLearningSettings] = useState(initialLearningSettings)

    // when any setting is change model needs to be compiled again
    useEffect(() => {
        setCompiled(false)
    }, [state])

    const incrementLayerUnits = useCallback((layerName: string) => {
        setState((state) => {
            const layerToChange = state.layers.find((layer) => layer.name === layerName)!
            if (layerToChange.units >= MAX_UNITS) return state
            layerToChange.units++
            return { ...state }
        })
    }, [])

    const decrementLayerUnits = useCallback((layerName) => {
        setState((state) => {
            const layerToChange = state.layers.find((layer) => layer.name === layerName)!
            if (layerToChange.units <= MIN_UNITS) return state
            layerToChange.units--
            return { ...state }
        })
    }, [])

    const addLayer = useCallback(() => {
        setState((state) => {
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
        setState((state) => {
            if (state.layers.length <= MIN_LAYERS) return state
            state.layers.splice(-2, 1)
            return { ...state }
        })
    }, [])

    const setActivationFunction = (layerName: string, newValue: ActivationIdentifier) => {
        setState((state) => {
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

        setState((state) => ({
            ...state,
            optimizer,
            optimizerOptions,
        }))
    }

    const compileModel = useCallback(async () => {
        const { layers, optimizer, optimizerOptions, loss, metric } = state
        setTrainingLogs([])

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
            optimizer: optimizer(...Object.values(optimizerOptions)),
            loss, // taka fcn jest w instrukcji
            metrics: tf.metrics[metric],
        })
        setCompiled(true)
        console.log('%cModel compiled succesfully', 'font-weight: bold; font-size: 16px;')
        model.current.summary()
    }, [state])

    const trainModel = useCallback(async () => {
        const { epochs, batchSize } = learningSettings
        setTraining(true)
        await model.current.fit(tf.tensor(trainX), tf.tensor(trainY), {
            batchSize,
            epochs,
            initialEpoch: trainingLogs.length,
            shuffle: true,
            validationSplit: 0.1,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    setTrainingLogs((prev) => [
                        ...prev,
                        { x: epoch, y: logs ? logs[state.metric] : 0 },
                    ])
                    console.log(logs)
                    // when fullfilling the training goal
                    /* if (epoch === 2) {
                        model.stopTraining = true
                    } */
                },
            },
        })
        setTraining(false)
    }, [learningSettings, state.metric, trainingLogs.length])

    const stopTraining = useCallback(() => {
        model.current.stopTraining = true
        setTraining(false)
    }, [model])

    const evaulateData = async (data: any) => {
        const predictedTensor = model.current.predict(tf.tensor(data)) as tf.Tensor
        const prediction = (await predictedTensor.array()) as []
        return prediction.map((predicted: number, index: number) => ({
            y: predicted,
            x: data[index],
        }))
    }

    const setBatchSize = (newValue: number) => {
        setLearningSettings((prev) => ({ ...prev, batchSize: newValue }))
    }

    const setEpochsNumber = (newValue: number) => {
        setLearningSettings((prev) => ({ ...prev, epochs: newValue }))
    }

    const setOptimizerOption = (key: any, newValue: any) => {
        setState((prev) => {
            const newState = {
                ...prev,
                optimizerOptions: { ...prev.optimizerOptions, [key]: newValue }, // WHY THIS CHANGES NUMBER INTO STRING ????
            }
            console.log(newState)
            return newState
        })
    }

    const setLoss = (newValue: LossesType) => {
        setState((prev) => {
            return { ...prev, loss: newValue }
        })
    }
    const setMetric = (newValue: MetricType) => {
        setState((prev) => {
            return { ...prev, metric: newValue }
        })
    }

    return (
        <TensorflowContext.Provider
            value={{
                trainingLogs,
                modelSettings: state,
                learningSettings,
                isCompiled,
                isTraining,
                trainModel,
                evaulateData,
                compileModel,
                incrementLayerUnits,
                decrementLayerUnits,
                addLayer,
                removeLayer,
                setActivationFunction,
                stopTraining,
                setBatchSize,
                setEpochsNumber,
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
