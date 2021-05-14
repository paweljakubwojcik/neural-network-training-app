import React from 'react'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

interface CounterControlProps {
    up: () => void
    down: () => void
    count: number
    min: number
    max: number
    styles?: object
}

export default function CounterControl({
    up,
    down,
    min,
    max,
    count,
    styles,
    ...props
}: CounterControlProps) {
    return (
        <div style={{ display: 'flex', ...styles }}>
            <IconButton onClick={up} size="small" disabled={count >= max}>
                <AddIcon fontSize="inherit" />
            </IconButton>

            <div style={{ margin: '0 .3em' }}> {count}</div>

            <IconButton onClick={down} size="small" disabled={count <= min}>
                <RemoveIcon fontSize="inherit" />
            </IconButton>
        </div>
    )
}
