import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
    palette: {
        text: {
            secondary: 'rgba(83, 83, 83, 0.88)',
        },
    },
    overrides: {
        MuiFormControl: {
            root: {
                margin: '0.5em',
            },
        },
    },
})
