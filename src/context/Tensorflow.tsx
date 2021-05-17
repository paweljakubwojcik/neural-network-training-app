import React, {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    useState,
    useContext,
} from 'react'
import * as tf from '@tensorflow/tfjs'

import { trainX, trainY } from '../util/MockData'
import getParamNames from '../util/getParamNames'

import { MIN_UNITS, MAX_UNITS, MAX_LAYERS, MIN_LAYERS } from '../constants'

import { losses, Optimizer, Sequential, train } from '@tensorflow/tfjs'
import type { ScatterDataPoint } from 'chart.js'

type ActivationIdentifier = 'linear' | 'relu'

type OptimizerType = keyof typeof train
type LossesType = keyof typeof losses
type MetricType = keyof typeof tf.metrics

type OptimizerConstructor = (...params: any) => Optimizer

export interface ModelSettings {
    layers: {
        name: string
        units: number
        activation: ActivationIdentifier | undefined
        adjustable: boolean
    }[]
    optimizer: OptimizerConstructor
    optimazerOptions: any
    loss: LossesType
    metric: MetricType
    batchSize: number
    epochs: number
}

console.log(Object.values(train).map((v) => getParamNames(v)))

const defaultOptimizerOptions: {
    [key: string]: number | boolean
} = {
    learningRate: 0.001,
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
    optimazerOptions: {
        learningRate: 0.001,
    },
    loss: 'meanSquaredError',
    metric: 'meanSquaredError',
    batchSize: 128,
    epochs: 100,
}

//TODO: define data interfaces or types
//TODO: model settings into it's own context, or reducer

type TensorflowContextType = {
    trainingLogs: ScatterDataPoint[]
    modelSettings: ModelSettings
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
}

const TensorflowContext = createContext<TensorflowContextType>({
    trainingLogs: [],
    modelSettings: initialModelSettings,
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
})

function TensorflowProvider({ children }: { children: ReactNode }) {
    const [trainingLogs, setTrainingLogs] = useState<ScatterDataPoint[]>([]) // FIXME: this doesn't make sense now,

    const model = useRef<Sequential>(tf.sequential())

    const [isCompiled, setCompiled] = useState(false)
    const [isTraining, setTraining] = useState(false)

    // possibly change it to hook
    const [state, setState] = useState(initialModelSettings)

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

    const setOptimizer = (newOptimazer: keyof typeof train) => {
        const optimizer = train[newOptimazer] as OptimizerConstructor
        const optimizerOptions: {
            [k: string]: number | undefined | boolean
        } = Object.fromEntries(
            getParamNames(optimizer).map(({ key, type, defaulValue: value }) => {
                let defaultValue = defaultOptimizerOptions[key]
                if (!value) defaultValue = defaultOptimizerOptions[key]
                if (type === 'boolean') defaultValue = value === 'true'
                if (type === 'number') defaultValue = parseInt(value!)
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
        const { layers, optimizer, optimazerOptions, loss, metric } = state
        setTrainingLogs([])

        model.current = tf.sequential({
            layers: layers.map(({ units, activation }, index) =>
                tf.layers.dense({
                    inputShape: index === 0 ? [units] : undefined,
                    units,
                    activation,
                })
            ),
        })

        model.current.compile({
            optimizer: optimizer(...Object.values(optimazerOptions)),
            loss, // taka fcn jest w instrukcji
            metrics: tf.metrics[metric],
        })
        setCompiled(true)
        console.log('%cModel compiled succesfully', 'font-weight: bold; font-size: 16px;')
        model.current.summary()
    }, [state])

    const trainModel = useCallback(async () => {
        const { epochs, batchSize } = state
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
                    // when fullfilling the training goal
                    /* if (epoch === 2) {
                        model.stopTraining = true
                    } */
                },
            },
        })
        setTraining(false)
    }, [state, trainingLogs.length])

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
        setState((prev) => ({ ...prev, batchSize: newValue }))
    }

    const setEpochsNumber = (newValue: number) => {
        setState((prev) => ({ ...prev, epochs: newValue }))
    }

    return (
        <TensorflowContext.Provider
            value={{
                trainingLogs,
                modelSettings: state,
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
            }}
        >
            {children}
        </TensorflowContext.Provider>
    )
}

const useTensorflow = () => useContext(TensorflowContext)

export { TensorflowContext, TensorflowProvider, useTensorflow }
