import { createContext, useCallback, useState } from 'react'
import trainData, { trainX } from '../util/MockData'

const initialState = {
    learning: trainData,
    validation: [],
    test: new Array(10).fill(0).map((_, i) => 5 * i),
    setLearningData: () => {},
    setValidationData: () => {},
    setTestData: () => {},
}

const DataContext = createContext({
    ...initialState,
})

function DataProvider({ children, ...props }) {
    const [{ learning, validation, test }, setState] = useState(initialState)

    const setLearningData = useCallback(
        (data) => setState((prev) => ({ ...prev, learning: data })),
        []
    )

    const setValidationData = useCallback(
        (data) => setState((prev) => ({ ...prev, validation: data })),
        []
    )

    const setTestData = useCallback((data) => setState((prev) => ({ ...prev, test: data })), [])

    return (
        <DataContext.Provider
            value={{
                learning,
                validation,
                test,
                setLearningData,
                setValidationData,
                setTestData,
            }}
            {...props}
        >
            {children}
        </DataContext.Provider>
    )
}

export { DataContext, DataProvider }
