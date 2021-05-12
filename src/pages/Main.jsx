import { Button, IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import StyledCard from '../components/StyledCard'
import { Container, Column } from '../components/Layout'

import Chart from '../components/Chart'
import { useContext } from 'react'
import { TensorflowContext } from '../context/Tensorflow'
import LayersControls from '../components/LayersControls'
import NetworkDiagram from '../components/NetworkDiagram'

const pointData = { datasets: [{ data: [{ x: 1, y: 1 }] }] }

export default function Main() {
    const { trainModel, stopTraining, compileModel, trainingLogs, isCompiled, isTraining } =
        useContext(TensorflowContext)
    console.log(trainingLogs)

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
                    <NetworkDiagram />
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
                        data={{ datasets: [{ data: trainingLogs }] }}
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
