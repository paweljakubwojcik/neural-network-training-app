import React, { createContext, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

import { trainX, trainY } from '../util/MockData'
import { ModelSettingsReducer } from './reducers/ModelSetting'
import {
    ADD_LAYER,
    DECREMENT_LAYER_UNITS,
    INCREMENT_LAYER_UNITS,
    REMOVE_LAYER,
    SET_ACTIVATION_FUNCTION,
    SET_OPTIMAZER,
} from './actions/ModelSettings'

const initialModelSettings = {
    layers: [
        {
            name: 'Input Layer',
            units: 1,
            activationFunc: 'linear',
            adjustable: false,
        },
        {
            name: 'Hidden Layer 1',
            units: 2,
            activationFunc: 'linear',
            adjustable: true,
        },
        {
            name: 'Output Layer',
            units: 1,
            activationFunc: 'linear',
            adjustable: true,
        },
    ],
    optimizer: tf.train.sgd,
    optimazerOptions: {
        learningRate: 0.0001,
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
    evaulateData: (data) => {},
    compileModel: () => {},
    incrementLayerUnits: (layerName) => {},
    decrementLayerUnits: (layerName) => {},
    addLayer: () => {},
    removeLayer: () => {},
    setActivationFunction: (layerName, newValue) => {},
}

const initialTrainingOptions = {
    batchSize: 128,
    epochs: 100,
}

const TensorflowContext = createContext({
    ...initialState,
})

function TensorflowProvider({ children, ...props }) {
    const [trainingLogs, setTrainingLogs] = useState([]) // FIXME: this doesn't make sense now,

    const model = useRef(null)
    const [isCompiled, setCompiled] = useState(false)
    const [isTraining, setTraining] = useState(false)
    const [trainingOptions, setTrainingOptions] = useState(initialTrainingOptions)

    // possibly change it to hook
    const [modelSettings, dispatch] = useReducer(ModelSettingsReducer, initialModelSettings)

    // when any setting is change model needs to be compiled again
    useEffect(() => {
        setCompiled(false)
    }, [modelSettings])

    const incrementLayerUnits = useCallback((layerName) => {
        dispatch({ type: INCREMENT_LAYER_UNITS, payload: { layerName } })
    }, [])

    const decrementLayerUnits = useCallback((layerName) => {
        dispatch({ type: DECREMENT_LAYER_UNITS, payload: { layerName } })
    }, [])

    const addLayer = useCallback(() => {
        dispatch({ type: ADD_LAYER })
    }, [])

    const removeLayer = useCallback(() => {
        dispatch({ type: REMOVE_LAYER })
    }, [])

    const setActivationFunction = (layerName, newValue) => {
        dispatch({ type: SET_ACTIVATION_FUNCTION, payload: { layerName, newValue } })
    }

    const setOptimazer = (newOptimazer) => {
        dispatch({ type: SET_OPTIMAZER, payload: { newOptimazer } })
    }

    const compileModel = useCallback(async () => {
        const { layers, optimizer, optimazerOptions, loss } = modelSettings
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
            metrics: [tf.metrics[loss]],
        })
        setCompiled(true)
        console.log('%cModel compiled succesfully', 'font-weight: bold; font-size: 16px;')
        model.current.summary()
    }, [model, modelSettings])

    const trainModel = useCallback(async () => {
        const { epochs, batchSize } = trainingOptions
        setTraining(true)
        await model.current.fit(tf.tensor(trainX), tf.tensor(trainY), {
            batchSize,
            epochs,
            initialEpoch: trainingLogs.length,
            shuffle: true,
            validationSplit: 0.1,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    setTrainingLogs((prev) => [...prev, { x: epoch, y: logs[modelSettings.loss] }])
                    // when fullfilling the training goal
                    /* if (epoch === 2) {
                        model.stopTraining = true
                    } */
                },
            },
        })
        setTraining(false)
    }, [modelSettings.loss, trainingLogs.length, trainingOptions])

    const stopTraining = useCallback(() => {
        model.current.stopTraining = true
        setTraining(false)
    }, [model])

    const evaulateData = async (data) => {
        const prediction = await model.current.predict(tf.tensor(data)).array()
        return prediction.map((predicted, index) => ({ y: predicted, x: data[index] }))
    }

    const setBatchSize = (newValue) => {
        setTrainingOptions((prev) => ({ ...prev, batchSize: newValue }))
    }

    const setEpochsNumber = (newValue) => {
        setTrainingOptions((prev) => ({ ...prev, epochs: newValue }))
    }

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
                setActivationFunction,
                evaulateData,
                setOptimazer,
                setBatchSize,
                setEpochsNumber,
                modelSettings,
                trainingOptions,
            }}
            {...props}
        >
            {children}
        </TensorflowContext.Provider>
    )
}

export { TensorflowContext, TensorflowProvider }
