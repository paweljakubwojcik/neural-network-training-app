import React, { useState } from 'react'

import { Button } from '@material-ui/core'

import StyledCard from '../components/StyledCard'
import { Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import { useTensorflow } from '../context/Tensorflow'
import { useData } from '../context/Data'
import ChartContainer from '../components/ChartContainer'

export default function TrainingSection() {
    const { isCompiled, isTraining, evaulateData } = useTensorflow()
    const [evaluationResults, setEvaluationResults] = useState({})

    const { evaluationData, learningData } = useData()

    const {
        palette: {
            primary: { main: MainColor },
            secondary: { main: SecondaryColor },
        },
    } = useTheme()

    console.log('render')

    return (
        <StyledCard>
            <ChartContainer
                title={'Data Evaluation'}
                id={'Data Evaluation'}
                data={{
                    datasets: [
                        {
                            data: learningData.scatter,
                            label: 'Evaulation Data',
                        },
                        {
                            data: evaluationResults.prediction,
                            label: 'Prediction',
                            backgroundColor: MainColor,
                            borderColor: MainColor,
                            pointRadius: 1,
                        },
                        {
                            data: evaluationResults.error,
                            label: 'Error',
                            backgroundColor: SecondaryColor,
                            borderColor: SecondaryColor,
                            pointRadius: 1,
                        },
                    ],
                }}
                options={{
                    animation: true,
                    parsing: {
                        xAxisKey: learningData.inputs.keys[0],
                        yAxisKey: learningData.labels.keys[0],
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: learningData.inputs.keys[0],
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: learningData.labels.keys[0],
                            },
                        },
                    },
                }}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    const { error, prediction } = evaulateData()
                    setEvaluationResults({ error, prediction })
                }}
                disabled={!isCompiled}
            >
                Evaulate
            </Button>
        </StyledCard>
    )
}
