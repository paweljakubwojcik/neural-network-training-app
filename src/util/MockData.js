// for now

const LENGTH = 100
const VALIDATION_SPLIT = 0.1
const TEST_LENGTH = 10

const noise = (level) => Math.random() * 2 * level - level
const linearF = (x, a, b) => x * a + b + noise(0.1)

const expF = (x, a, b) => Math.pow(a * x + noise(0.3), 2)

const trainX = new Array(LENGTH).fill(0).map((zero, index) => index)
const trainData = trainX.map((x, index) => [x, expF(x, 0.05, 0)])

const testData = new Array(TEST_LENGTH).fill(0).map((_, i) => [10 * i])

export { trainData, testData }
