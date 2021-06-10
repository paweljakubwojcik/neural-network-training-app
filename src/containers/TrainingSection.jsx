import React from 'react'

import { Button } from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'

import StyledCard from '../components/StyledCard'
import { Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import { useTensorflow } from '../context/Tensorflow'
import { useData } from '../context/Data'
import LearningSettings from '../containers/LearningSettings'
import ChartContainer from '../components/ChartContainer'

export default function TrainingSection() {
    const {
        trainModel,
        stopTraining,
        trainingLogs,
        trainingValLogs,
        trainingEffects,
        isCompiled,
        isTraining,
        modelSettings: { metric },
        learningSettings: { epochs },
    } = useTensorflow()

    const { learningData } = useData()

    const {
        palette: {
            primary: { main: MainColor },
            secondary: { main: SecondaryColor },
        },
    } = useTheme()

    return (
        <StyledCard>
            <ChartContainer
                title={'Data Visualization'}
                id={'Data Visualization'}
                data={{
                    datasets: [
                        {
                            data: learningData.scatter,
                            label: 'Learning data',
                        },
                        {
                            data: trainingEffects,
                            label: 'Prediction',
                            showLine: true,
                            backgroundColor: SecondaryColor,
                            borderColor: SecondaryColor,
                            pointRadius: 1,
                        },
                    ],
                }}
                options={{
                    animation: false,
                    parsing: {
                        xAxisKey: learningData.inputs.keys[0],
                        yAxisKey: learningData.labels.keys[0],
                    },
                }}
            />
            <ChartContainer
                data={{
                    datasets: [
                        {
                            data: trainingLogs,
                            label: metric,
                            borderColor: MainColor,
                            backgroundColor: MainColor,
                            showLine: true,
                            pointRadius: 0,
                        },
                        {
                            data: trainingValLogs,
                            label: `Validation error`,
                            borderColor: SecondaryColor,
                            backgroundColor: SecondaryColor,
                            showLine: true,
                            pointRadius: 0,
                        },
                    ],
                }}
                options={{
                    animation: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Epoch',
                            },
                            max: epochs > 0 ? epochs : 1,
                            min: 0,
                        },
                    },
                }}
                title={'Learning curve'}
                id={'LearningCurve'}
            />

            <StyledCard.Header>
                <h3>Training options</h3>
            </StyledCard.Header>
            <LearningSettings />
            <Row>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={isTraining ? stopTraining : trainModel}
                    endIcon={isTraining ? <PauseIcon /> : <PlayArrowIcon />}
                    disabled={!isCompiled && !isTraining}
                >
                    {isTraining ? 'stop' : 'Train'}
                </Button>
            </Row>
        </StyledCard>
    )
}
