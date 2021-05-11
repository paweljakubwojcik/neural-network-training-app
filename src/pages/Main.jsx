import styled from 'styled-components'
import { Card } from '@material-ui/core'
import { Container, Row } from '../components/Layout'

import Chart from '../components/Chart'

export default function Main() {
    return (
        <Container>
            <Row>
                <Row.Header>Model</Row.Header>
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
            </Row>
            <Row>
                <Row.Header>Training</Row.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Learning curve</h2>
                    </StyledCard.Header>
                    <Chart data={{ datasets: [{ data: [{ x: 1, y: 1 }] }] }} />
                </StyledCard>
            </Row>
            <Row>
                <Row.Header>Evaluation</Row.Header>
                <StyledCard>
                    <StyledCard.Header>
                        <h2>Effects</h2>
                    </StyledCard.Header>
                    <Chart data={{ datasets: [{ data: [{ x: 1, y: 1 }] }] }} />
                </StyledCard>
            </Row>
        </Container>
    )
}

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    padding: 1em;
    margin: 0.4em;
    width: 500px;
`

StyledCard.Header = styled.header`
    display: flex;
    width: 100%;
`
