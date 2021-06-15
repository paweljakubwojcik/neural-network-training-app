import React, { useState } from 'react'

import { Button } from '@material-ui/core'

import StyledCard from '../components/StyledCard'
import { Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import { useTensorflow } from '../context/Tensorflow'
import { useData } from '../context/Data'
import ChartContainer from '../components/ChartContainer'
import TextField from '@material-ui/core/TextField'

export default function TrainingSection() {
    const { isCompiled, isTraining, evaulateData } = useTensorflow()
    const [evaluationResults, setEvaluationResults] = useState({ evaluation: ['', ''] })

    const { evaluationData } = useData()

    const {
        palette: {
            primary: { main: MainColor },
            secondary: { main: SecondaryColor },
        },
    } = useTheme()

    console.log(evaluationResults)

    return (
        <StyledCard>
            <ChartContainer
                title={'Data Evaluation'}
                id={'Data Evaluation'}
                data={{
                    datasets: [
                        {
                            data: evaluationData.scatter,
                            label: 'Evaulation Data',
                        },
                        {
                            data: evaluationResults.prediction,
                            label: 'Prediction',
                            backgroundColor: MainColor,
                            borderColor: MainColor,
                        },
                        {
                            data: evaluationResults.error,
                            label: 'Error',
                            backgroundColor: SecondaryColor,
                            borderColor: SecondaryColor,
                        },
                    ],
                }}
                options={{
                    animation: true,
                }}
                xkeys={evaluationData.inputs.keys}
                ykeys={evaluationData.labels.keys}
            />
            <Row>
                <TextField
                    label={'metric loss loss'}
                    inputProps={{ readOnly: true }}
                    value={evaluationResults.evaluation[0].toString()}
                />
                <TextField
                    label={'validation loss'}
                    inputProps={{ readOnly: true }}
                    value={evaluationResults.evaluation[1].toString()}
                    variant="outlined"
                />
            </Row>
            <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                    const { error, prediction, evaluation } = evaulateData()
                    setEvaluationResults({ error, prediction, evaluation })
                }}
                disabled={!isCompiled}
            >
                Evaulate
            </Button>
        </StyledCard>
    )
}
