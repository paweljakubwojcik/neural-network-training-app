import { useTheme } from '@material-ui/core'
import React from 'react'

export default function ErrorMessage({ children, ...props }: React.ComponentProps<'div'>) {
    const {
        palette: {
            error: { main: color },
        },
    } = useTheme()

    return <div style={{ color, margin: '1em' }}>{children}</div>
}
