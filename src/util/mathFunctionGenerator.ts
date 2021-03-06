const DEFAULT_MIN = 0
const DEFAULT_MAX = 50
const DEFAULT_LENGTH = 50

const getNoise = (level: number) => Math.random() * 2 * level - level

const getXs = (min: number, max: number, length: number) => {
    if (length <= 0) throw new Error('length of a data vector must be a positive number')
    return new Array(length).fill(0).map((x, i) => (i / length) * (max - min) + min)
}

const mathFunctionGenerator = {
    /**
     * y = a * x + b + noise
     */
    linear: (params: {
        a: number
        b: number
        noise?: number
        min?: number
        max?: number
        length?: number
    }) => {
        const {
            a,
            b,
            noise = 0,
            min = DEFAULT_MIN,
            max = DEFAULT_MAX,
            length = DEFAULT_LENGTH,
        } = params
        return getXs(min, max, length).map((x) => ({ x, y: x * a + b + getNoise(noise) }))
    },
    /**
     * y = (a + noise)^x
     */
    exp: (params?: { a?: number; noise?: number; min: number; max: number; length: number }) => {
        const {
            a = Math.E,
            noise = 0,
            min = DEFAULT_MIN,
            max = DEFAULT_MAX,
            length = DEFAULT_LENGTH,
        } = params || {}
        return getXs(min, max, length).map((x) => ({ x, y: Math.pow(a + getNoise(noise), x) }))
    },
    sin: (params: {
        a: number
        w: number
        noise?: number
        min: number
        max: number
        length: number
    }) => {
        const {
            a,
            w,
            noise = 0,
            min = DEFAULT_MIN,
            max = DEFAULT_MAX,
            length = DEFAULT_LENGTH,
        } = params
        return getXs(min, max, length).map((x) => ({
            x,
            y: a * (Math.sin(x * (1 / w) * (2 * Math.PI)) + getNoise(noise)),
        }))
    },
    gauss: (params: {
        a: number
        sigma: number
        noise?: number
        min: number
        max: number
        length: number
    }) => {
        const {
            a,
            sigma,
            noise = 0,
            min = DEFAULT_MIN,
            max = DEFAULT_MAX,
            length = DEFAULT_LENGTH,
        } = params
        return getXs(min, max, length).map((x) => ({
            x,
            y:
                (1 / Math.sqrt(2 * Math.PI * sigma * sigma)) *
                    Math.exp(-Math.pow(x - a, 2) / (2 * sigma * sigma)) +
                getNoise(noise),
        }))
    },
}

const defaultParams = ['noise', 'min', 'max', 'length']

export const paramMap = {
    linear: ['a', 'b'].concat(defaultParams),
    exp: ['a'].concat(defaultParams),
    sin: ['a', 'w'].concat(defaultParams),
    gauss: ['a', 'sigma'].concat(defaultParams),
}

export const defaults = {
    linear: {
        a: 1,
        b: 1,
        noise: 0,
        min: DEFAULT_MIN,
        max: DEFAULT_MAX,
        length: DEFAULT_LENGTH,
    },
    exp: {
        a: Math.E,
        noise: 0,
        min: DEFAULT_MIN,
        max: DEFAULT_MAX,
        length: DEFAULT_LENGTH,
    },
    sin: {
        a: 1,
        w: 25,
        noise: 0,
        min: DEFAULT_MIN,
        max: DEFAULT_MAX,
        length: DEFAULT_LENGTH,
    },
    gauss: {
        a: 10,
        sigma: 3,
        noise: 0,
        min: DEFAULT_MIN,
        max: DEFAULT_MAX,
        length: DEFAULT_LENGTH,
    },
}

export default mathFunctionGenerator
