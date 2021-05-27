import React, { useState } from 'react'

import { Button, IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'

import StyledCard from '../components/StyledCard'
import { Container, Column, Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import { useTensorflow } from '../context/Tensorflow'
import LayersControls from '../containers/LayersControls'
import NetworkDiagram from '../components/NetworkDiagram'
import useChartData from '../hooks/useChartData'
import { useData } from '../context/Data'
import ModelOptions from '../containers/ModelOptions'
import LearningSettings from '../containers/LearningSettings'
import DataInputForm from '../components/DataInputForm'
import { getDataFromCSVFile } from '../util/dataConverter'
import ChartContainer from '../containers/ChartContainer'
import TrainingDataForm from '../containers/TrainingDataForm'

export default function Main() {
    const {
        trainModel,
        evaulateData,
        stopTraining,
        compileModel,
        trainingLogs,
        trainingEffects,
        isCompiled,
        isTraining,
        modelSettings: { layers, metric },
        learningSettings: { epochs },
    } = useTensorflow()

    const { learning: learningData } = useData()

    const {
        palette: {
            primary: { main: MainColor },
            secondary: { main: SecondaryColor },
        },
    } = useTheme()

    const [predictedData, setPrediction] = useState([])

    const pointData = useChartData({
        datasets: [
            { data: learningData.scatter, label: 'Learning data' },
            {
                data: trainingEffects,
                label: 'Prediction',
                showLine: true,
                backgroundColor: SecondaryColor,
                borderColor: SecondaryColor,
                pointRadius: 1,
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
            <Column gridName={'model'}>
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
                        <Button color="primary" onClick={compileModel}>
                            Reset model
                        </Button>
                    </Row>
                </StyledCard>
            </Column>

            {/* Training section */}
            <Column gridName={'training'}>
                <Column.Header>Training</Column.Header>

                <TrainingDataForm />

                <StyledCard>
                    <StyledCard.Header>
                        <h2>Learning curve</h2>
                    </StyledCard.Header>
                    <ChartContainer
                        data={trainingData}
                        options={{
                            animation: false,
                            scales: {
                                x: {
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
                            disabled={!isCompiled}
                        >
                            {isTraining ? 'stop' : 'Train'}
                        </Button>
                    </Row>
                </StyledCard>
            </Column>
            {/* Evaulation section */}
            <Column gridName={'evaulation'}>
                <Column.Header>Evaulation</Column.Header>
                <StyledCard /* style={{ width: '50%', marginRight: 'auto', marginLeft: 0 }} */>
                    <StyledCard.Header>
                        <h2>Test data</h2>
                    </StyledCard.Header>
                    <Row>
                        <DataInputForm
                            onUpload={async (file) => {
                                console.log(await getDataFromCSVFile(file))
                            }}
                        />
                    </Row>
                </StyledCard>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Effects</h2>
                    </StyledCard.Header>
                    <ChartContainer
                        data={pointData}
                        title={'Evaluation Chart'}
                        id={'Evaluation Chart'}
                        options={{
                            animation: false,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            setPrediction(await evaulateData())
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
