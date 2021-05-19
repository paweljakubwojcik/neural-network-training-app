import { TextField } from '@material-ui/core'
import { Row } from '../components/Layout'
import { useTensorflow } from '../context/Tensorflow'

export default function LearningSettings() {
    const {
        learningSettings: { batchSize, epochs },
        setEpochsNumber,
        setBatchSize,
    } = useTensorflow()

    return (
        <>
            <Row>
                <TextField
                    id="Epochs"
                    label="Epochs"
                    type="number"
                    value={epochs.toString()}
                    onChange={(e) => {
                        setEpochsNumber(e.target.valueAsNumber)
                    }}
                />
                <TextField
                    id="BatchSize"
                    label="BatchSize"
                    type="number"
                    value={batchSize.toString()}
                    onChange={(e) => {
                        setBatchSize(e.target.valueAsNumber)
                    }}
                />
            </Row>
        </>
    )
}
