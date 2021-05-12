// for now
export const trainX = [
    3.3, 4.4, 5.5, 6.71, 6.93, 4.168, 9.779, 6.182, 7.59, 2.167, 7.042, 10.791, 5.313, 7.997, 5.654,
    9.27, 3.1,
]
export const trainY = [
    1.7, 2.76, 2.09, 3.19, 1.694, 1.573, 3.366, 2.596, 2.53, 4.221, 6.827, 1.465, 4.65, 5.904, 9.42,
    10.94, 11.3,
]

let trainData = []
for (let i = 0; i < trainY.length; i++) {
    trainData.push({ x: trainX[i], y: trainY[i] })
}

export default trainData
