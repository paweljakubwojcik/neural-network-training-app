import { Button, IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import StyledCard from '../components/StyledCard'
import { Container, Column } from '../components/Layout'

import Chart from '../components/Chart'
import { useContext } from 'react'
import { TensorflowContext } from '../context/Tensorflow'
import LayersControls from '../components/LayersControls'
import NetworkDiagram from '../components/NetworkDiagram'
import useChartData from '../hooks/useChartData'
import { DataContext } from '../context/Data'

export default function Main() {
    const {
        trainModel,
        stopTraining,
        compileModel,
        trainingLogs,
        isCompiled,
        isTraining,
        modelSettings: { layers, loss },
    } = useContext(TensorflowContext)

    const { test: testData, learning: learningData } = useContext(DataContext)

    const pointData = useChartData({
        datasets: [{ data: learningData, label: 'Learning data' }],
    })

    const trainingData = useChartData({
        datasets: [
            {
                data: trainingLogs,
                label: loss,
                pointBackgroundColor: 'blue',
                backgroundColor: 'blue',
                showLine: true,
            },
        ],
    })

    return (
        <Container>
            <Column>
                <Column.Header>Model</Column.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Network structure</h2>
                        <IconButton size="small" color="inherit">
                            <SettingsIcon />
                        </IconButton>
                    </StyledCard.Header>
                    <NetworkDiagram layers={layers.map((layer) => layer.units)} />
                    <LayersControls />
                    <StyledCard.Header>
                        <h2>Model options</h2>
                    </StyledCard.Header>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={compileModel}
                        disabled={isCompiled}
                    >
                        {isCompiled ? 'Compiled' : 'Compile model'}
                    </Button>
                </StyledCard>
            </Column>
            <Column>
                <Column.Header>Training</Column.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Learning curve</h2>
                    </StyledCard.Header>
                    <Chart
                        data={trainingData}
                        options={{ animation: false }}
                        title={'Learning curve'}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={isTraining ? stopTraining : trainModel}
                        disabled={!isCompiled}
                    >
                        {isTraining ? 'stop' : 'Train'}
                    </Button>
                </StyledCard>
            </Column>
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
                        onClick={() => {}}
                        disabled={!isCompiled}
                    >
                        Evaulate
                    </Button>
                </StyledCard>
            </Column>
        </Container>
    )
}
