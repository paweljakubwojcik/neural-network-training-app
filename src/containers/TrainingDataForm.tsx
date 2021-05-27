import React, { useRef, useState, ChangeEvent, useCallback } from 'react'
import StyledCard, { StyledCardHeader } from '../components/StyledCard'
import { Row } from '../components/Layout'

import { getDataFromCSVFile } from '../util/dataConverter'
import { useData } from '../context/Data'
import { Button, MenuItem } from '@material-ui/core'
import FileInput from '../components/FileInput'
import TextField from '@material-ui/core/TextField'
import DoneIcon from '@material-ui/icons/Done'

enum formState {
    FILE = 'FILE',
    URL = 'URL',
    MATH = 'MATH',
}

function TrainingDataForm() {
    const { setLearningData } = useData()

    const inputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState<string>()

    const [method, setMethod] = useState(formState.FILE)

    const [fields, setFields] = useState<string[] | undefined>()
    const [data, setData] = useState<{ [key: string]: any }[]>([{}])

    console.log(data)

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)
        if (file) {
            setFileName(file?.name)
            const { data, fields } = await getDataFromCSVFile(file)
            setFields(fields)
            setData(data)
        }
    }

    const loadData = useCallback(
        (label: string, input: string) => {
            const wantedData = data.map((dataPoint) => [dataPoint[input], dataPoint[label]])
            setLearningData(wantedData as number[][])
        },
        [data, setLearningData]
    )

    return (
        <StyledCard>
            <StyledCardHeader>
                <h2>Training data</h2>
            </StyledCardHeader>

            <Row>
                <FileInput
                    name={'training Data'}
                    helperText="drop data here"
                    ref={inputRef}
                    onChange={handleUpload}
                />
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                        inputRef.current?.click()
                        setMethod(formState.FILE)
                    }}
                >
                    Load from disk
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setMethod(formState.URL)}
                >
                    Load from URL
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => setMethod(formState.MATH)}
                >
                    Load basic math function
                </Button>
            </Row>
            <Row>
                {method === formState.FILE && fileName && <div>{`uploaded ${fileName}`}</div>}
                {method === formState.URL && (
                    <DataFromURLForm setData={setData} setFields={setFields} />
                )}
                {method === formState.MATH && <div>options for math func</div>}
            </Row>
            {fields && <ChooseDataForm fields={fields} loadData={loadData} />}
        </StyledCard>
    )
}

export default TrainingDataForm

const getDataType = (url: string) => {
    return url.split('.').reverse()[0]
}

const DataFromURLForm = ({
    setFields,
    setData,
}: {
    setFields: (fileds: string[] | undefined) => void
    setData: (data: { [key: string]: string | number }[]) => void
}) => {
    const [URL, setURL] = useState('https://storage.googleapis.com/tfjs-tutorials/carsData.json')

    const handleClick = async () => {
        const res = await fetch(URL, {})
        const type = getDataType(URL)
        if (type === 'json') {
            const data = await res.json()
            const fields = Object.keys(data[0])
            setFields(fields)
            setData(data)
        }
        if (type === 'csv') {
            const { data, fields } = await getDataFromCSVFile(await res.text())
            setFields(fields)
            setData(data)
        }
    }

    return (
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TextField
                id="URL-Fetch"
                label="URL"
                type="search"
                variant="outlined"
                margin="dense"
                fullWidth
                value={URL}
                onChange={(e) => setURL(e.target.value)}
            />
            <Button onClick={handleClick}>Load</Button>
        </Row>
    )
}

const ChooseDataForm = ({
    fields,
    loadData,
}: {
    fields: string[]
    loadData: (label: string, input: string) => void
}) => {
    const [label, setLabel] = useState<string>(fields[0])
    const [input, setInput] = useState<string>(fields[0])

    return (
        <Row>
            <TextField
                id="select-input"
                label="Input"
                value={input}
                fullWidth
                select
                onChange={(e) => setInput(e.target.value as string)}
            >
                {fields.map((field) => (
                    <MenuItem value={field} key={field}>
                        {field}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                id="select-label"
                label="Label"
                value={label}
                fullWidth
                select
                onChange={(e) => setLabel(e.target.value as string)}
            >
                {fields.map((field) => (
                    <MenuItem value={field} key={field}>
                        {field}
                    </MenuItem>
                ))}
            </TextField>
            <Button onClick={() => loadData(label, input)}>
                <DoneIcon />
            </Button>
        </Row>
    )
}
