import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

interface PopMenuProps {
    options: string[]
    handleClose: () => void
    onChange: (value: string) => void
    open: boolean
    anchorEl: HTMLElement | null | undefined
    value: string | undefined
}

export default function PopMenu({
    options,
    handleClose,
    open,
    anchorEl,
    value,
    onChange,
}: PopMenuProps) {
    return (
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
            {options.map((op) => (
                <MenuItem
                    onClick={() => {
                        onChange(op)
                        handleClose()
                    }}
                    selected={op === value}
                >
                    {op}
                </MenuItem>
            ))}
        </Menu>
    )
}
