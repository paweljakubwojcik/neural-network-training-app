import React, { useState } from 'react'

import { dataSubFormProps } from './DataForm'
import { Row } from '../../components/Layout'
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

import { getDataFromCSVFile } from '../../util/dataConverter'

const getDataType = (url: string) => {
    return url.split('.').reverse()[0]
}

export default function DataFromURLForm({ setFields, setData }: dataSubFormProps) {
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
