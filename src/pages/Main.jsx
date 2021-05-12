import styled from 'styled-components'
import { Card, Button } from '@material-ui/core'
import { Container, Column } from '../components/Layout'

import Chart from '../components/Chart'
import { useContext } from 'react'
import { TensorflowContext } from '../context/Tensorflow'

const pointData = { datasets: [{ data: [{ x: 1, y: 1 }] }] }

export default function Main() {
    const { trainModel, trainingLogs } = useContext(TensorflowContext)
    console.log(trainingLogs)

    return (
        <Container>
            <Column>
                <Column.Header>Model</Column.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Network structure</h2>
                    </StyledCard.Header>
                </StyledCard>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Network options</h2>
                    </StyledCard.Header>
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
                    <Button variant="contained" color="primary" onClick={trainModel}>
                        Train
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
                </StyledCard>
            </Column>
        </Container>
    )
}

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
    margin: 0.4em;
    width: 500px;
`

StyledCard.Header = styled.header`
    display: flex;
    width: 100%;
`
