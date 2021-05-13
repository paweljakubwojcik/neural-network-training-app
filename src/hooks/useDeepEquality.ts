import { useState, useEffect } from 'react'
import deepEqual from 'deep-equal'

// more generic version of useChartData, might use this in the future
/**
 * updates data only when something changes according to deep equality
 *
 * normally react compares props with Object.is() algorithm,
 * which returns true only if compared objects are the same object in memory
 * for example {} === {} is false
 * deep equality on the other hand in example above qould return true because compared objects are composed from same values
 * */
export default function useDeepEquality<S>(newState: S) {
    const [state, setState] = useState(newState)

    useEffect(() => {
        const shouldUpdate = !deepEqual(state, newState)
        if (shouldUpdate) setState(newState)
    }, [newState, state])

    return state
}
