import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

import { trainX, trainY } from '../util/MockData'

const initialModelSettings = {
    layers: [
        {
            name: 'Input Layer',
            units: 1,
            activationFunc: 'linear',
        },
        {
            name: 'Hidden Layer 1',
            units: 2,
            activationFunc: 'linear',
        },
        {
            name: 'Output Layer',
            units: 1,
            activationFunc: 'linear',
        },
    ],
    optimazer: tf.train.sgd,
    optimazerOptions: {
        learningRate: 0.001,
    },
    loss: 'meanSquaredError',
}

//TODO: define data interfaces or types
//TODO: model settings into it's own context, or reducer

const initialState = {
    trainingLogs: [],
    modelSettings: initialModelSettings,
    isCompiled: false,
    trainModel: () => {},
    evulateData: (data) => {},
    compileModel: () => {},
    incrementLayerUnits: (layerName) => {},
    decrementLayerUnits: (layerName) => {},
    addLayer: () => {},
    reomveLayer: (layerName) => {},
}

const TensorflowContext = createContext({
    ...initialState,
})

function TensorflowProvider({ children, ...props }) {
    const [{ trainingLogs }, setState] = useState(initialState) // FIXME: this doesn't make sense now,

    const { current: model } = useRef(tf.sequential())
    const [isCompiled, setCompiled] = useState(false)
    const [isTraining, setTraining] = useState(false)
    const [modelSettings, setModelSettings] = useState(initialModelSettings)

    useEffect(() => {
        setCompiled(false)
    }, [modelSettings])

    const incrementLayerUnits = useCallback((layerName) => {
        setModelSettings((settings) => {
            const layerToIncrementIndex = settings.layers.findIndex(
                (layer) => layer.name === layerName
            )
            settings.layers[layerToIncrementIndex].units++
            return { ...settings }
        })
    }, [])

    const decrementLayerUnits = useCallback((layerName) => {
        setModelSettings((settings) => {
            const layerToIncrementIndex = settings.layers.findIndex(
                (layer) => layer.name === layerName
            )
            settings.layers[layerToIncrementIndex].units--
            return { ...settings }
        })
    }, [])

    const addLayer = useCallback(() => {
        setModelSettings((settings) => {
            settings.layers.splice(-1, 0, {
                name: `Hidden Layer ${settings.layers.length - 1}`,
                units: 1,
                activationFunc: 'linear',
            })
            return { ...settings }
        })
    }, [])

    const removeLayer = useCallback(() => {
        setModelSettings((settings) => {
            settings.layers.splice(-2, 1)
            return { ...settings }
        })
    }, [])

    const compileModel = useCallback(async () => {
        const { layers, optimazer, optimazerOptions, loss } = modelSettings

        layers.forEach(({ units, activation }, index) => {
            model.add(
                tf.layers.dense({
                    inputShape: index === 0 ? [units] : undefined,
                    units,
                    activation,
                })
            )
        })

        model.compile({
            optimizer: optimazer(...Object.values(optimazerOptions)),
            loss, // taka fcn jest w instrukcji
            metrics: [tf.metrics[loss]],
        })
        setCompiled(true)
        console.log(model.summary())
    }, [model, modelSettings])

    const trainModel = useCallback(async () => {
        setTraining(true)
        await model.fit(tf.tensor(trainX), tf.tensor(trainY), {
            batchSize: 32,
            epochs: 100,
            shuffle: true,
            validationSplit: 0.1,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    setState((prev) => ({
                        ...prev,
                        trainingLogs: [
                            ...prev.trainingLogs,
                            { x: epoch, y: logs[modelSettings.loss] },
                        ],
                    }))
                    /* if (epoch === 2) {
                        model.stopTraining = true
                    } */
                },
            },
        })
        setTraining(false)
    }, [model, modelSettings.loss])

    const stopTraining = useCallback(() => {
        model.stopTraining = true
        setTraining(false)
    }, [model])

    return (
        <TensorflowContext.Provider
            value={{
                model,
                trainingLogs,
                isCompiled,
                isTraining,
                trainModel,
                stopTraining,
                compileModel,
                incrementLayerUnits,
                decrementLayerUnits,
                addLayer,
                removeLayer,
                modelSettings,
            }}
            {...props}
        >
            {children}
        </TensorflowContext.Provider>
    )
}

export { TensorflowContext, TensorflowProvider }
