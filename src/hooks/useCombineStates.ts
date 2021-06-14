import { useEffect, useState } from 'react'

export default function useCombineStates(stateArray: any[]) {
    const [state, setState] = useState(stateArray)

    useEffect(() => {
        setState(stateArray)
    }, [stateArray])

    return state
}
