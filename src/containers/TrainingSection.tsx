import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'

import StyledCard, { StyledCardHeader } from '../components/StyledCard'
import { Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import { onEpochEndCallback, useTensorflow } from '../context/Tensorflow'
import { useData } from '../context/Data'
import LearningSettings from './LearningSettings'
import ChartContainer from '../components/ChartContainer'
import ErrorMessage from '../components/ErrorMessage'

export default function TrainingSection() {
    const [errors, setErrors] = useState<Error>()

    const {
        trainModel,
        stopTraining,
        isCompiled,
        isTraining,
        modelSettings: { metric },
        learningSettings: { epochs },
    } = useTensorflow()

    const [trainingLogs, setTrainingLogs] = useState<{ [key: string]: number }[]>([])
    const [trainingValLogs, setTrainingValLogs] = useState<{ [key: string]: number }[]>([])
    const [trainingEffects, setTrainingEffects] = useState<{ [key: string]: number }[]>([])

    const { learningData } = useData()

    const {
        palette: {
            primary: { main: MainColor },
            secondary: { main: SecondaryColor },
        },
    } = useTheme()

    const onEpochEndCallback: onEpochEndCallback = async ({ metric, val }, currentPrediction) => {
        setTrainingLogs((prev) => [...prev, metric])
        setTrainingValLogs((prev) => [...prev, val])
        setTrainingEffects(currentPrediction)
    }

    const onTrainBeginCallback = () => {
        setTrainingLogs([])
        setTrainingValLogs([])
        setTrainingEffects([])
    }

    const handleTrainModel = async () => {
        try {
            await trainModel({ onEpochEndCallback, onTrainBeginCallback })
        } catch (error) {
            setErrors(error)
        }
    }
    return (
        <StyledCard>
            <ChartContainer
                title={'Data Visualization'}
                id={'Data Visualization'}
                data={{
                    datasets: [
                        {
                            data: learningData.scatter as any,
                            label: 'Learning data',
                        },
                        {
                            data: trainingEffects as any,
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
            <ChartContainer
                data={{
                    datasets: [
                        {
                            data: trainingLogs as any,
                            label: metric,
                            borderColor: MainColor,
                            backgroundColor: MainColor,
                            showLine: true,
                            pointRadius: 0,
                        },
                        {
                            data: trainingValLogs as any,
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

            <StyledCardHeader>
                <h3>Training options</h3>
            </StyledCardHeader>
            <LearningSettings />
            <Row>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={isTraining ? stopTraining : handleTrainModel}
                    endIcon={isTraining ? <PauseIcon /> : <PlayArrowIcon />}
                    disabled={!isCompiled && !isTraining}
                >
                    {isTraining ? 'stop' : 'Train'}
                </Button>
            </Row>
            {errors && <ErrorMessage>{`${errors.name}:  ${errors.message}`}</ErrorMessage>}
        </StyledCard>
    )
}
