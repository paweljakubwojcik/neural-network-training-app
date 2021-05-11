import React, { createContext, useState } from 'react'

const initialState = {
    model: null,
}

const TensorflowContext = createContext({
    ...initialState,
})

function TensorflowProvider({ children, ...props }) {
    const [{ model }, setState] = useState(initialState)

    return (
        <TensorflowContext.Provider
            value={{
                model,
            }}
            {...props}
        >
            {children}
        </TensorflowContext.Provider>
    )
}

export { TensorflowContext, TensorflowProvider }
