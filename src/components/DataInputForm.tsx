import { Button } from '@material-ui/core'
import { ChangeEvent, useRef, useState } from 'react'
import FileInput, { FileInputWrapper } from './FileInput'
import styled from 'styled-components'

interface DataInputFormrops {
    name: string
    value: any
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onUpload?: (file: File) => void
}

export default function DataInputForm({ name, value, onChange, onUpload }: DataInputFormrops) {
    const input = useRef<HTMLInputElement | null>(null)
    const [fileName, setFileName] = useState<string | null | undefined>(null)

    const handleClick = () => {
        if (input.current) input.current.click()
    }

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.item(0)
        setFileName(file?.name)
        if (onChange) onChange(e)
        if (onUpload && file) onUpload(file)
    }

    return (
        <>
            <FileInput
                name={name}
                helperText="drop data here"
                ref={input}
                onChange={handleUpload}
            />
            <Button variant="contained" size="small" color="primary" onClick={handleClick}>
                {'Load data'}
            </Button>
            <UploadedFile>{fileName}</UploadedFile>
        </>
    )
}

const Wrapper = styled(FileInputWrapper)`
    display: flex;
    align-items: center;
    width: 100%;
`

const UploadedFile = styled.div`
    display: flex;
    margin: 1em;
`
