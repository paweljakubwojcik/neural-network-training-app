import { Checkbox, FormControlLabel, TextField } from '@material-ui/core'
import { Row } from '../components/Layout'
import { useTensorflow } from '../context/Tensorflow'

export default function LearningSettings() {
    const {
        learningSettings: { batchSize, epochs, normalize },
        setLearningOption,
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
                        setLearningOption({ epochs: e.target.valueAsNumber })
                    }}
                />
                <TextField
                    id="BatchSize"
                    label="BatchSize"
                    type="number"
                    value={batchSize.toString()}
                    onChange={(e) => {
                        setLearningOption({ batchSize: e.target.valueAsNumber })
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            color="primary"
                            checked={normalize}
                            onChange={() => {
                                setLearningOption({ normalize: !normalize })
                            }}
                            name="Normalize"
                        />
                    }
                    label="Normalize data"
                />
            </Row>
        </>
    )
}
