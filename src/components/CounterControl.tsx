import React, { ChangeEventHandler, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

interface CounterControlProps {
    setCounter: (newValue: number) => void
    count: number
    step?: number
    min?: number
    max?: number
    styles?: object
}

export default function CounterControl({
    setCounter,
    step = 1,
    count,
    min,
    max,
    styles,
    ...props
}: CounterControlProps) {
    const inputRef = useRef<HTMLInputElement>()

    const increment = () => {
        setCounter(count + step)
    }
    const decrement = () => {
        setCounter(count - step)
    }

    useEffect(() => {
        if (inputRef?.current) inputRef.current.value = count.toString()
    }, [count])

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newValue = e.target.valueAsNumber
        if (newValue) setCounter(e.target.valueAsNumber)
    }

    return (
        <div style={{ display: 'flex', ...styles }}>
            <IconButton onClick={increment} size="small" disabled={max ? count >= max : false}>
                <AddIcon fontSize="inherit" />
            </IconButton>

            <StyledInput
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="number"
                onInput={handleChange}
                size={0}
                style={{ margin: '0 .3em' }}
            />

            <IconButton onClick={decrement} size="small" disabled={min ? count <= min : false}>
                <RemoveIcon fontSize="inherit" />
            </IconButton>
        </div>
    )
}

const StyledInput = styled.input`
    display: flex;
    width: 3em;
    &::-webkit-inner-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    appearance: textfield;
`
