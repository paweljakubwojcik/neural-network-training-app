import React, { useState } from 'react'
import StyledCard, { StyledCardHeader } from '../../components/StyledCard'
import { Row } from '../../components/Layout'

import { Button, ButtonGroup } from '@material-ui/core'

import DataFromDiskForm from './DataFromDiskForm'
import DataFromURLForm from './DataFromURLForm'
import ChooseInputOutputs from './ChooseInputOutputs'

enum formState {
    FILE = 'Load from disk',
    URL = 'Load from URL',
    MATH = 'Generate math func',
}

export interface dataSubFormProps {
    setFields: (fileds: string[] | undefined) => void
    setData: (data: { [key: string]: string | number }[]) => void
}

function DataForm() {
    const [method, setMethod] = useState(formState.FILE)

    const [fields, setFields] = useState<string[] | undefined>()
    const [data, setData] = useState<{ [key: string]: any }[]>([{}])

    return (
        <StyledCard>
            <StyledCardHeader>
                <h2>Training data</h2>
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
                {method === formState.MATH && <div>options for math func</div>}
            </Row>
            {fields && <ChooseInputOutputs fields={fields} data={data} />}
        </StyledCard>
    )
}

export default DataForm
