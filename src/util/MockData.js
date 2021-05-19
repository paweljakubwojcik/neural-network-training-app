// for now

const LENGTH = 128
const TEST_LENGTH = 20
export const trainX = new Array(LENGTH).fill(0).map((zero, index) => index)
export const trainY = new Array(LENGTH)
    .fill(0)
    .map((zero, index) => Math.random() * 20 - 10 + index * 2)

let trainData = []
for (let i = 0; i < trainY.length; i++) {
    trainData.push({ x: trainX[i], y: trainY[i] })
}

export const testData = new Array(TEST_LENGTH).fill(0).map((_, i) => (LENGTH / TEST_LENGTH) * i)

export default trainData
