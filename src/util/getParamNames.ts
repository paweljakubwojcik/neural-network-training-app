const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
const ARGUMENT_NAMES = /([^\s,]+)/g

const TYPES: {
    [key: string]: 'boolean' | 'number'
} = {
    centered: 'boolean',
    epsilon: 'number',
    momentum: 'number',
    decay: 'number',
    learningRate: 'number',
    useNesterov: 'boolean',
    rho: 'number',
    initialAccumulatorValue: 'number',
    beta2: 'number',
    beta1: 'number',
}

type Params = {
    key: string
    defaulValue?: string
    type: 'boolean' | 'number' | 'undefined'
}

/**
 *
 * @param func
 * @returns Array of objects containing names , type and default value of parameters of a function
 */
export default function getParamNames(func: Function): {
    key: string
    defaulValue?: string
    type: 'boolean' | 'number' | 'undefined'
}[] {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '')
    const result = fnStr
        .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
        .match(ARGUMENT_NAMES) as string[]
    if (result === null) return []

    return result.reduce((a, word, i) => {
        if (i === 0) return [{ key: word, type: TYPES[word] }, ...a]
        if (word === '=') return [...a]
        if (result[i - 1] === '=') {
            a[0].defaulValue = word
            return [...a]
        }
        return [{ key: word, type: TYPES[word] }, ...a]
    }, [] as Params[])
}
