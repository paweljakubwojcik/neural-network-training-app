import React, { createContext, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

import { trainX, trainY } from '../util/MockData'

const initialModel = tf.sequential({
    layers: [
        tf.layers.dense({
            inputShape: [1],
            units: 1,
            useBias: false,
        }),
        tf.layers.dense({ units: 1, useBias: false }),
    ],
})

//TODO: define data interfaces or types

const initialState = {
    model: initialModel,
    trainingLogs: [],
    trainModel: () => {},
    evulateData: (data) => {},
}

const TensorflowContext = createContext({
    ...initialState,
})

function TensorflowProvider({ children, ...props }) {
    const [{ model, trainingLogs }, setState] = useState(initialState)

    model.compile({
        optimizer: tf.train.sgd(0.001),
        loss: 'meanSquaredError', // taka fcn jest w instrukcji
        metrics: [tf.metrics.meanAbsoluteError],
    })

    const trainModel = async () => {
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
                            { x: epoch, y: logs.meanAbsoluteError },
                        ],
                    }))
                },
            },
        })
    }

    return (
        <TensorflowContext.Provider
            value={{
                model,
                trainingLogs,
                trainModel,
            }}
            {...props}
        >
            {children}
        </TensorflowContext.Provider>
    )
}

export { TensorflowContext, TensorflowProvider }
