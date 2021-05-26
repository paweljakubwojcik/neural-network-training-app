import React, { useState, useEffect, forwardRef, CSSProperties, ChangeEvent } from 'react'
import styled from 'styled-components/macro'

interface FileInputProps {
    name: string
    helperText?: string
    style?: CSSProperties
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const FileInput = forwardRef(
    (
        { name, helperText, style, onChange, ...props }: FileInputProps,
        ref: React.ForwardedRef<HTMLInputElement>
    ) => {
        const [fileInputVisibility, setFileInputVis] = useState(false)
        const [fileInputHover, setFileInputHover] = useState(false)

        const handleBodyDrag = (e: DragEvent) => {
            if (e.type === 'dragenter') setFileInputVis(true)
            if (e.type === 'dragleave' && !e.relatedTarget) setFileInputVis(false)
            if (e.type === 'drop') setFileInputVis(false)
        }

        useEffect(() => {
            document.addEventListener('dragleave', handleBodyDrag)
            document.addEventListener('dragenter', handleBodyDrag)
            document.addEventListener('drop', handleBodyDrag)

            return () => {
                document.removeEventListener('dragenter', handleBodyDrag)
                document.removeEventListener('dragleave', handleBodyDrag)
                document.removeEventListener('drop', handleBodyDrag)
            }
        }, [])

        return (
            <>
                <StyledInput
                    {...props}
                    ref={ref}
                    $visibility={fileInputVisibility}
                    name={name}
                    id="file"
                    type="file"
                    accept=".mat, .csv"
                    onChange={onChange}
                    onDragEnter={() => {
                        setFileInputHover(true)
                    }}
                    onDragLeave={() => {
                        setFileInputHover(false)
                    }}
                />
                <Label $visibility={fileInputVisibility} hover={fileInputHover} htmlFor={name}>
                    {helperText}
                </Label>
            </>
        )
    }
)

export default FileInput

export const FileInputWrapper = styled.div`
    position: relative;
`

const StyledInput = styled.input<{
    readonly $visibility: boolean
}>`
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;

    z-index: ${(props) => (props.$visibility ? '1' : '-1')};
`

const Label = styled.label<{
    readonly $visibility: boolean
    readonly hover: boolean
}>`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: ${(props) => (props.$visibility ? '1' : '0')};
    font-weight: bold;
    border-radius: 0.5em;
    pointer-events: none;

    display: flex;
    justify-content: center;
    align-items: center;
    transition: color 0.3s, background-color 0.3s, opacity 0.3s;
    color: var(--primary-color-contrastText);
    background-color: ${(props) =>
        props.hover ? 'var(--primary-color-light)' : ' var(--primary-color);'};
`
