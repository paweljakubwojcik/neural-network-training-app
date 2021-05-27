import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { trainData, testData } from '../util/MockData'
import * as tf from '@tensorflow/tfjs'
import { ScatterDataPoint } from 'chart.js'
import normalizeTensor from '../util/normalizeTensor'

type Data = {
    x: tf.Tensor
    y: tf.Tensor
    inputMax: tf.Tensor
    inputMin: tf.Tensor
    labelMax: tf.Tensor
    labelMin: tf.Tensor
    scatter: ScatterDataPoint[]
    unNormalized: {
        x: tf.Tensor
        y: tf.Tensor
    }
}

// DATA NEED TO BE NORMALISED
//TODO: make it so x and y can have more dimensions
const createData = (data: number[][]) => {
    const scatter = data.map(([x, y]) => ({ x, y }))
    const tensors = tf.tidy(() => {
        tf.util.shuffle(data)

        const inputs = data.map(([x, y]) => x)
        const labels = data.map(([x, y]) => y)

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
        const labelTensor = tf.tensor2d(labels, [labels.length, 1])

        const {
            normalizedTensor: normalizedInputs,
            Min: inputMin,
            Max: inputMax,
        } = normalizeTensor(inputTensor)
        const {
            normalizedTensor: normalizedLabels,
            Min: labelMin,
            Max: labelMax,
        } = normalizeTensor(labelTensor)

        return {
            x: normalizedInputs,
            y: normalizedLabels,
            inputMax,
            inputMin,
            labelMax,
            labelMin,
            unNormalized: {
                x: inputTensor,
                y: labelTensor,
            },
        }
    })

    return {
        scatter,
        ...tensors,
    } as Data
}

type dataSetter = (data: number[][]) => void

type DataState = {
    learning: Data
    /* validation: Data
     */
    test: Data
    setLearningData: dataSetter
    /* setValidationData: dataSetter */
    setTestData: dataSetter
}

const initialState: DataState = {
    learning: createData(trainData),
    /*  validation: tensor(trainData), */
    test: createData(testData),
    setLearningData: (data: number[][]) => {},
    /*   setValidationData: (data: number[][]) => {}, */
    setTestData: (data: number[][]) => {},
}

const DataContext = createContext({
    ...initialState,
})

const useData = () => useContext(DataContext)

function DataProvider({ children, ...props }: { children: ReactNode }) {
    const [learning, setLearning] = useState(initialState.learning)
    /*  const [validation, setValidation] = useState(initialState.validation) */
    const [test, setTest] = useState(initialState.test)

    const setLearningData = useCallback((data: number[][]) => setLearning(createData(data)), [])

    /* const setValidationData = (data) => setValidation(new Data(data)) */

    const setTestData = (data: number[][]) => setTest(createData(data))

    return (
        <DataContext.Provider
            value={{
                learning,
                /* validation, */
                test,
                setLearningData,
                /* setValidationData, */
                setTestData,
            }}
            {...props}
        >
            {children}
        </DataContext.Provider>
    )
}

export { DataContext, DataProvider, useData }
