import React, { useContext } from 'react'
import styled from 'styled-components'

import { train } from '@tensorflow/tfjs'

import { Select, MenuItem, TextField } from '@material-ui/core'
import { TensorflowContext } from '../context/Tensorflow'

export default function ModelOptions() {
    const {
        modelSettings: { optimizer, batchSize, epochs, optimazerOptions },
        setEpochsNumber,
        setBatchSize,
        setOptimizer,
    } = useContext(TensorflowContext)

    const learningAlgorithmOptions = Object.entries(optimazerOptions)

    return (
        <Container>
            <Row>
                <Select
                    value={optimizer.name}
                    onChange={(e) => {
                        setOptimizer(e.target.value)
                    }}
                    style={{ width: '100%' }}
                >
                    {Object.keys(train).map((method) => (
                        <MenuItem value={method} key={method}>
                            {method}
                        </MenuItem>
                    ))}
                </Select>
            </Row>
            <Row>
                {learningAlgorithmOptions.map(([key, value]) => {
                    if (typeof value === 'number')
                        return (
                            <TextField
                                label={key}
                                key={key}
                                type="number"
                                value={value}
                                onChange={(e) => {
                                    console.log(`changed ${key}`)
                                }}
                            />
                        )
                    if (typeof value === 'boolean')
                        return (
                            <Select
                                value={value}
                                key={key}
                                label={key}
                                onChange={(e) => {
                                    console.log(`changed ${key}`)
                                }}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        )
                    return null
                })}
            </Row>
            <Row>
                <TextField
                    id="standard-basic"
                    label="Epochs"
                    type="number"
                    value={epochs}
                    onChange={(e) => {
                        setEpochsNumber(Math.floor(e.target.value))
                    }}
                />
                <TextField
                    id="standard-basic"
                    label="BatchSize"
                    type="number"
                    value={batchSize}
                    onChange={(e) => {
                        setBatchSize(Math.floor(e.target.value))
                    }}
                />
            </Row>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`

const Row = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    margin: 1em;

    & > * {
        margin: 0.5em;
    }
`
