import { createContext, useCallback, useContext, useState } from 'react'
import trainData, { testData } from '../util/MockData'

const initialState = {
    learning: trainData,
    validation: [],
    test: testData,
    setLearningData: () => {},
    setValidationData: () => {},
    setTestData: () => {},
}

const DataContext = createContext({
    ...initialState,
})

const useData = () => useContext(DataContext)

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

export { DataContext, DataProvider, useData }
