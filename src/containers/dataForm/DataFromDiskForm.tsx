import React, { useRef, useState, ChangeEvent } from 'react'
import { getDataFromCSVFile } from '../../util/dataConverter'
import { Button } from '@material-ui/core'
import FileInput from '../../components/FileInput'

import { dataSubFormProps } from './DataForm'

export default function DataFromDiskForm({ setData, setFields }: dataSubFormProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const [fileName, setFileName] = useState<string>()

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)
        if (file) {
            setFileName(file?.name)
            const { data, fields } = await getDataFromCSVFile(file)
            setFields(fields)
            setData(data)
        }
    }

    return (
        <>
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
                }}
            >
                Load from disk
            </Button>
        </>
    )
}
