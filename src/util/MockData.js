// for now

const LENGTH = 100
const TEST_LENGTH = 10
export const trainX = new Array(LENGTH).fill(0).map((zero, index) => index)
export const trainY = new Array(LENGTH)
    .fill(0)
    .map((zero, index) => index / LENGTH + Math.random() * 0.2 - 0.1)

let trainData = []
for (let i = 0; i < trainY.length; i++) {
    trainData.push({ x: trainX[i], y: trainY[i] })
}

export const testData = new Array(TEST_LENGTH).fill(0).map((_, i) => (LENGTH / TEST_LENGTH) * i)

export default trainData
