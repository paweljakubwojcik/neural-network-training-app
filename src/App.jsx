import { DataProvider } from './context/Data'
import { TensorflowProvider } from './context/Tensorflow'
import Main from './pages/Main'
import { GlobalStyles } from './styles/globalStyles'
import { theme } from './styles'
import { ThemeProvider } from '@material-ui/core/styles'

export default function App() {
    return (
        <>
            <DataProvider>
                <TensorflowProvider>
                    <ThemeProvider theme={theme}>
                        <GlobalStyles theme={theme} />
                        <Main />
                    </ThemeProvider>
                </TensorflowProvider>
            </DataProvider>
        </>
    )
}
