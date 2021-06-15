import React, { ChangeEvent, useState } from 'react'
import { DataObject } from '../../context/Data'
import mathFunctionGenerator, { paramMap, defaults } from '../../util/mathFunctionGenerator'
import { Button, ButtonGroup, TextField } from '@material-ui/core'
import { Row, Column } from '../../components/Layout'

interface mathFunctionGeneratoProps {
    dataContext: DataObject
}

type funcUnion = keyof typeof paramMap

const FUNC = Object.keys(paramMap) as funcUnion[]

export default function MathFunctionGenerator({ dataContext }: mathFunctionGeneratoProps) {
    const [func, setFunction] = useState<funcUnion>(FUNC[0])
    const [params, setParams] = useState<{ [key: string]: number }>(defaults[FUNC[0]])

    return (
        <Column>
            <ButtonGroup variant="contained" size="small" color="primary">
                {FUNC.map((value) => (
                    <Button
                        key={value}
                        variant={'text'}
                        disabled={func === value}
                        size="small"
                        color="primary"
                        onClick={() => {
                            setFunction(value)
                            setParams(defaults[value])
                        }}
                    >
                        {value}
                    </Button>
                ))}
            </ButtonGroup>
            <Row>
                {paramMap[func].map((param) => (
                    <TextField
                        key={param}
                        id={param}
                        label={param}
                        type="number"
                        value={params[param].toString()}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setParams((prev) => ({ ...prev, [param]: e.target.valueAsNumber }))
                        }}
                    />
                ))}
            </Row>
            <Button
                onClick={() => {
                    const generated = mathFunctionGenerator[func](params as any)
                    dataContext.addInput({ x: generated.map(({ x }) => x) })
                    dataContext.addLabel({ y: generated.map(({ y }) => y) })
                }}
            >
                Ok
            </Button>
        </Column>
    )
}
