import React, { useState } from 'react'

import { Button, IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import StyledCard from '../components/StyledCard'
import { Container, Column, Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import Chart from '../components/Chart'

import { useTensorflow } from '../context/Tensorflow'
import LayersControls from '../containers/LayersControls'
import NetworkDiagram from '../components/NetworkDiagram'
import useChartData from '../hooks/useChartData'
import { useData } from '../context/Data'
import ModelOptions from '../containers/ModelOptions'
import LearningSettings from '../containers/LearningSettings'
import DataInputForm from '../components/DataInputForm'

export default function Main() {
    const {
        trainModel,
        evaulateData,
        stopTraining,
        compileModel,
        trainingLogs,
        isCompiled,
        isTraining,
        modelSettings: { layers, metric },
        learningSettings: { epochs },
    } = useTensorflow()

    const { test: testData, learning: learningData } = useData()

    const {
        palette: {
            primary: { main: MainColor },
            secondary: { main: SecondaryColor },
        },
    } = useTheme()

    const [predictedData, setPrediction] = useState([])

    const pointData = useChartData({
        datasets: [
            { data: learningData, label: 'Learning data' },
            {
                data: predictedData,
                label: 'Prediction',
                showLine: true,
                backgroundColor: SecondaryColor,
                pointBackgroundColor: SecondaryColor,
                borderColor: SecondaryColor,
            },
        ],
    })

    const trainingData = useChartData({
        datasets: [
            {
                data: trainingLogs,
                label: metric,
                pointBackgroundColor: MainColor,
                backgroundColor: MainColor,
                showLine: true,
            },
        ],
    })

    return (
        <Container>
            {/* Model section */}
            <Column>
                <Column.Header>Model</Column.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Network structure</h2>
                        <IconButton size="small" color="inherit">
                            <SettingsIcon />
                        </IconButton>
                    </StyledCard.Header>
                    <NetworkDiagram layers={layers.map((layer) => layer.units)} color={MainColor} />
                    <LayersControls />
                    <StyledCard.Header>
                        <h2>Model options</h2>
                    </StyledCard.Header>
                    <ModelOptions />
                    <Row>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={compileModel}
                            disabled={isCompiled}
                        >
                            {isCompiled ? 'Compiled' : 'Compile model'}
                        </Button>
                        <Button color="primary" onClick={() => console.log('randomize weights')}>
                            Reset model
                        </Button>
                    </Row>
                </StyledCard>
            </Column>
            {/* Training section */}
            <Column>
                <Column.Header>Training</Column.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Learning curve</h2>
                    </StyledCard.Header>
                    <Chart
                        data={trainingData}
                        options={{
                            animation: false,
                            scales: {
                                x: {
                                    max: epochs,
                                    min: 0,
                                },
                            },
                        }}
                        title={'Learning curve'}
                    />
                    <Row>
                        <DataInputForm
                            onUpload={(file) => {
                                console.log(file)
                            }}
                        />
                    </Row>

                    <StyledCard.Header>
                        <h3>Training options</h3>
                    </StyledCard.Header>
                    <LearningSettings />
                    <Row>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={isTraining ? stopTraining : trainModel}
                            disabled={!isCompiled}
                        >
                            {isTraining ? 'stop' : 'Train'}
                        </Button>
                    </Row>
                </StyledCard>
            </Column>
            {/* Evaulation section */}
            <Column>
                <Column.Header>Evaluation</Column.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Effects</h2>
                    </StyledCard.Header>
                    <Chart data={pointData} title={'Evaluation Chart'} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            setPrediction(await evaulateData(testData))
                        }}
                        disabled={!isCompiled}
                    >
                        Evaulate
                    </Button>
                </StyledCard>
            </Column>
        </Container>
    )
}
