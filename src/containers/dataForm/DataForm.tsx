import React, { useState } from 'react'
import StyledCard, { StyledCardHeader } from '../../components/StyledCard'
import { Row } from '../../components/Layout'

import { Button, ButtonGroup } from '@material-ui/core'

import DataFromDiskForm from './DataFromDiskForm'
import DataFromURLForm from './DataFromURLForm'
import ChooseInputOutputs from './ChooseInputOutputs'
import { useData } from '../../context/Data'
import MathFunctionGenerator from './MathFunctionGenerator'

enum formState {
    FILE = 'Load from disk',
    URL = 'Load from URL',
    MATH = 'Generate math func',
}

export interface dataSubFormProps {
    setFields: (fileds: string[] | undefined) => void
    setData: (data: { [key: string]: string | number }[]) => void
}

interface DataFormProps {
    whichData: 'learningData' | 'evaluationData'
    header: string
}

function DataForm({ whichData, header }: DataFormProps) {
    const dataContext = useData()

    const [method, setMethod] = useState(formState.FILE)

    const [fields, setFields] = useState<string[] | undefined>()
    const [data, setData] = useState<{ [key: string]: any }[]>([{}])

    return (
        <StyledCard>
            <StyledCardHeader>
                <h2>{header}</h2>
            </StyledCardHeader>
            <Row>
                <ButtonGroup variant="contained" size="small" color="primary">
                    {Object.values(formState).map((value) => (
                        <Button
                            key={value}
                            variant={'text'}
                            disabled={method === value}
                            size="small"
                            color="primary"
                            onClick={() => {
                                setMethod(value)
                                setFields(undefined)
                            }}
                        >
                            {value}
                        </Button>
                    ))}
                </ButtonGroup>
            </Row>
            <Row>
                {method === formState.FILE && (
                    <DataFromDiskForm setData={setData} setFields={setFields} />
                )}
                {method === formState.URL && (
                    <DataFromURLForm setData={setData} setFields={setFields} />
                )}
                {method === formState.MATH && (
                    <MathFunctionGenerator dataContext={dataContext[whichData]} />
                )}
            </Row>
            {fields && (
                <ChooseInputOutputs
                    fields={fields}
                    data={data}
                    dataContext={dataContext[whichData]}
                />
            )}
        </StyledCard>
    )
}

export default DataForm
