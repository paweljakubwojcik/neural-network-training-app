import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Tensor, TensorLike } from '@tensorflow/tfjs'
import { useCallback } from 'react'

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

export type InputOutputVector = {
    data: TensorsSet
    asTensor: Tensor
    keys: string[]
}

type DataObject = {
    inputs: InputOutputVector
    labels: InputOutputVector
    scatter: { [key: string]: number }[]
    addInput: (data: TensorsSet) => void
    addLabel: (data: TensorsSet) => void
    removeInput: (key: string | undefined) => void
    removeLabel: (key: string | undefined) => void
}

const initialInputOutputVector = {
    asTensor: tf.tensor([]),
    keys: [],
    data: {},
}

function useDataObject(): DataObject {
    const [inputs, setInputs] = useState<InputOutputVector>(initialInputOutputVector)
    const [labels, setLabels] = useState<InputOutputVector>(initialInputOutputVector)
    const [scatter, setScatter] = useState<{ [key: string]: number }[]>([])

    useEffect(() => {
        const merged = { ...inputs.data, ...labels.data }
        /* const keys = Object.keys(merged)
        if (!keys.length) return

        const tensor = tf.tensor([inputs.asTensor.arraySync(), labels.asTensor.arraySync()])
        console.log(tensor.shape)
        const scatter = (tensor.reshape([-1, tensor.shape[0]]).arraySync() as number[][]).map(
            (array) => Object.fromEntries(array.map((value, index) => [keys[index], value]))
        ) */

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

        console.log({ inputs, labels })
    }, [inputs, labels])

    const getDataSetter = useCallback(
        (setter: any) => (data: TensorsSet) => {
            //check for TensorLikeObjects
            Object.entries(data).forEach(([key, value]) => {
                if (!(value instanceof Tensor)) {
                    data[key] = tf.tensor(value)
                }
            })
            setter((existing: InputOutputVector) => {
                const tensorList = { ...existing.data, ...data }
                return {
                    data: tensorList,
                    asTensor: tf.tensor(
                        Object.values(tensorList).map((value) => (value as Tensor).arraySync())
                    ),
                    keys: Object.keys(tensorList),
                }
            })
        },
        []
    )

    const getDataRemover = useCallback(
        (setter: any) => (key: string | undefined) => {
            if (!key) return
            setter((existing: InputOutputVector) => {
                const tensorList = Object.fromEntries(
                    Object.entries(existing.data).filter(([name]) => name !== key)
                ) as TensorsSet
                return {
                    data: tensorList,
                    asTensor: tf.tensor(
                        Object.values(tensorList).map((value) => (value as Tensor).arraySync())
                    ),
                    keys: Object.keys(tensorList),
                }
            })
        },
        []
    )

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
