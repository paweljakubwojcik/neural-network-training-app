import { DataProvider } from './context/Data'
import { TensorflowProvider } from './context/Tensorflow'
import Main from './pages/Main'
import { GlobalStyles } from './styles/globalStyles'

export default function App() {
    return (
        <>
            <DataProvider>
                <TensorflowProvider>
                    <GlobalStyles />
                    <Main />
                </TensorflowProvider>
            </DataProvider>
        </>
    )
}
