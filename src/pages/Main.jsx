import React, { useState } from 'react'

import { Button, IconButton } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'

import StyledCard from '../components/StyledCard'
import { Container, Column, Row } from '../components/Layout'
import { useTheme } from '@material-ui/core/styles'

import { useTensorflow } from '../context/Tensorflow'
import LayersControls from '../containers/LayersControls'
import NetworkDiagram from '../components/NetworkDiagram'
import ModelOptions from '../containers/ModelOptions'
import DataInputForm from '../components/DataInputForm'
import { getDataFromCSVFile } from '../util/dataConverter'
import TrainingDataForm from '../containers/TrainingDataForm'
import TrainingSection from '../containers/TrainingSection'
import EvaluationSection from '../containers/EvaluationSection'

export default function Main() {
    const {
        compileModel,
        isCompiled,
        modelSettings: { layers },
    } = useTensorflow()

    const {
        palette: {
            primary: { main: MainColor },
        },
    } = useTheme()

    console.log('render')

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
                <TrainingSection />
            </Column>
            {/* Evaulation section */}
            <Column gridName={'evaulation'}>
                <Column.Header>Evaluation</Column.Header>
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

                <EvaluationSection />
            </Column>
        </Container>
    )
}
