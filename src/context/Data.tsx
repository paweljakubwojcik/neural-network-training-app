import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { trainData, testData } from '../util/MockData'
import * as tf from '@tensorflow/tfjs'
import { Tensor, TensorLike } from '@tensorflow/tfjs'
import { ScatterDataPoint } from 'chart.js'

const initialState = {
    learningData: {} as DataObject,
    evaluationData: {} as DataObject,
}

const DataContext = createContext({
    ...initialState,
})

type TensorsSet = {
    [name: string]: Tensor | TensorLike
}

type InputOutputVector = {
    asTensor: Tensor
    keys: string[]
} & TensorsSet

type DataObject = {
    inputs: InputOutputVector
    labels: InputOutputVector
    scatter: { [key: string]: number }[]
    addInput: (data: TensorsSet) => void
    addLabel: (data: TensorsSet) => void
    removeInput: (key: string) => void
    removeLabel: (key: string) => void
}

const initialInputOutputVector = {
    asTensor: tf.tensor([]),
    keys: [],
}

function useDataObject(): DataObject {
    const [inputs, setInputs] = useState<InputOutputVector>(initialInputOutputVector)
    const [labels, setLabels] = useState<InputOutputVector>(initialInputOutputVector)
    const [scatter, setScatter] = useState<{ [key: string]: number }[]>([])

    useEffect(() => {
        const merged = { ...inputs, ...labels }
        const scatter = Object.entries(merged)
            .filter(([key]) => key !== 'keys' && key !== 'asTensor')
            .reduce((scatter, [key, value]) => {
                const asArray = (value as Tensor).arraySync() as number[]
                asArray.forEach((value, index) => {
                    scatter[index] = { ...scatter[index], [key]: value }
                })
                return scatter
            }, [] as { [key: string]: number }[])

        setScatter(scatter)
    }, [inputs, labels])

    const getDataSetter = (setter: any) => (data: TensorsSet) => {
        //check for TensorLikeObjects
        Object.entries(data).forEach(([key, value]) => {
            if (!(value instanceof Tensor)) {
                data[key] = tf.tensor(value)
            }
        })
        setter((existing: InputOutputVector) => {
            const tensorList = { ...existing, ...data }
            return {
                ...tensorList,
                asTensor: tf.concat(Object.values(tensorList)),
                keys: Object.keys(tensorList).filter((key) => key !== 'keys' && key !== 'asTensor'),
            }
        })
    }

    const getDataRemover = (setter: any) => (key: string) => {
        setter(
            (existing: InputOutputVector) =>
                Object.fromEntries(
                    Object.entries(existing).filter(([name]) => name !== key)
                ) as InputOutputVector
        )
    }

    const addInput = getDataSetter(setInputs)
    const addLabel = getDataSetter(setLabels)

    const removeInput = getDataRemover(setInputs)
    const removeLabel = getDataRemover(setLabels)

    return {
        inputs,
        labels,
        addInput,
        addLabel,
        removeInput,
        removeLabel,
        scatter,
    }
}

function DataProvider({ children, ...props }: { children: ReactNode }) {
    const learningData = useDataObject()
    const evaluationData = useDataObject()

    console.log(learningData)

    return (
        <DataContext.Provider
            value={{
                learningData,
                evaluationData,
            }}
            {...props}
        >
            {children}
        </DataContext.Provider>
    )
}

const useData = () => useContext(DataContext)

export { DataContext, DataProvider, useData }
