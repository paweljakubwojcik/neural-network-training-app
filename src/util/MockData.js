// for now

const LENGHT = 50
export const trainX = new Array(LENGHT).fill(0).map((zero, index) => index)
export const trainY = new Array(LENGHT).fill(0).map((zero, index) => Math.random() * 20 - 10 + index * 2)

let trainData = []
for (let i = 0; i < trainY.length; i++) {
    trainData.push({ x: trainX[i], y: trainY[i] })
}

export default trainData
