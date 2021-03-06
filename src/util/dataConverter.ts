/* import jBinary from 'jbinary'
import MAT from './jMatFile' */

import Papa, { ParseResult } from 'papaparse'

/* const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    }) */

export const getDataFromMatFile = async (file: File) => {
    /* const file64 = await toBase64(file)
    var jb = new jBinary(file64, MAT)
    const mat = jb.read('mat')
    console.log(mat) */
    /* fs.readFile(path, (err, data) => {
        const jb = new jBinary(data, MAT)
        const mat = jb.read('mat')
        console.log(mat)
    }) */
    /* const file64 = await toBase64(file)

    jBinary.load(file64, MAT).then((binary) => {
        console.log(binary.readAll())
    }) */
}

/* const transposeMatrix = (matrix: number[][]) => {
    return matrix.reduce(
        (result, row) => {
            row.forEach((element, i) => {
                if (isNaN(element)) return
                if (!result[i]) result.push([])
                result[i].push(element)
            })
            return result
        },
        [[]] as number[][]
    )
} */

export const getDataFromCSVFile: (
    file: File | string
) => Promise<{ data: { [key: string]: string | number }[]; fields?: string[] }> = async (file) => {
    return new Promise((res, rej) => {
        Papa.parse(file, {
            complete: ({
                data,
                errors,
                meta: { fields },
            }: ParseResult<{ [key: string]: string | number }>) => {
                if (errors.length) {
                    console.log(errors)
                    rej(errors)
                } else res({ data, fields })
            },
            /*  transform: (value) => (!isNaN(parseFloat(value)) ? parseFloat(value) : value), */
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: (header: string, index: number) =>
                isNaN(parseFloat(header)) ? header : index?.toString(),
        })
    })
}
