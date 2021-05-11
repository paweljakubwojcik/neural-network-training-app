import { TensorflowProvider } from './context/Tensorflow'
import Main from './pages/Main'
import { GlobalStyles } from './styles/globalStyles'

export default function App() {
    return (
        <>
            <TensorflowProvider>
                <GlobalStyles />
                <Main />
            </TensorflowProvider>
        </>
    )
}
