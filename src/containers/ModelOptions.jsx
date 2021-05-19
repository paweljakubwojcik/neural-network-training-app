import styled from 'styled-components'
import { Row } from '../components/Layout'
import { train } from '@tensorflow/tfjs'
import { Select, MenuItem, Input, InputLabel, FormControl } from '@material-ui/core'
import { useTensorflow } from '../context/Tensorflow'

export default function ModelOptions() {
    const {
        modelSettings: { optimizer, optimizerOptions },
        setOptimizer,
        setOptimizerOption,
    } = useTensorflow()

    const learningAlgorithmOptions = Object.entries(optimizerOptions)

    return (
        <Container>
            <Row>
                <FormControl style={{ width: '100%' }}>
                    <InputLabel id="Learning-algorithm-label">Learning Algoritm</InputLabel>
                    <Select
                        labelId={'Learning-algorithm-label'}
                        value={optimizer.name}
                        onChange={(e) => {
                            setOptimizer(e.target.value)
                        }}
                    >
                        {Object.keys(train).map((method) => (
                            <MenuItem value={method} key={method}>
                                {method}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Row>
            <Row style={{ flexWrap: 'wrap', justifyContent: 'start' }}>
                {learningAlgorithmOptions.map(([key, value]) => (
                    <FormControl key={key}>
                        <InputLabel id={key}>{key}</InputLabel>
                        {typeof value === 'number' && (
                            <Input
                                key={key}
                                type="number"
                                value={optimizerOptions[key]}
                                onInput={(e) => {
                                    setOptimizerOption(key, e.target.valueAsNumber)
                                }}
                            />
                        )}
                        {typeof value === 'boolean' && (
                            <Select
                                value={optimizerOptions[key]}
                                key={key}
                                labelId={key}
                                onChange={(e) => {
                                    setOptimizerOption(key, e.target.value)
                                }}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        )}
                    </FormControl>
                ))}
            </Row>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`
