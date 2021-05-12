import React from 'react'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'

interface CounterControlProps {
    up: () => void
    down: () => void
    count: number
}

export default function CounterControl({ up, down, count }: CounterControlProps) {
    return (
        <div style={{ display: 'flex' }}>
            <IconButton onClick={up} size="small">
                <AddIcon fontSize="inherit" />
            </IconButton>
            <div style={{ margin: '0 .3em' }}> {count}</div>
            <IconButton onClick={down} size="small">
                <RemoveIcon fontSize="inherit" />
            </IconButton>
        </div>
    )
}
