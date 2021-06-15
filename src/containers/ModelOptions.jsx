import styled from 'styled-components'
import { Row } from '../components/Layout'
import { Select, MenuItem, Input, InputLabel, FormControl } from '@material-ui/core'
import { useTensorflow } from '../context/Tensorflow'
import { LOSSES_FUNCTIONS, METRICS } from '../constants'

import { OPTIMIZERS } from '../constants/optimizers'

export default function ModelOptions() {
    const {
        modelSettings: { optimizer, optimizerOptions, loss, metric },
        setOptimizer,
        setOptimizerOption,
        setLoss,
        setMetric,
    } = useTensorflow()

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
                        {Object.keys(OPTIMIZERS).map((method) => (
                            <MenuItem value={method} key={method}>
                                {method}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Row>
            <Row style={{ flexWrap: 'wrap', justifyContent: 'start' }}>
                {optimizer.parameters.map(({ name, type }) => (
                    <FormControl key={name} style={{ maxWidth: '50%' }}>
                        <InputLabel id={name}>{name}</InputLabel>
                        {type === 'number' && (
                            <Input
                                key={name}
                                type="number"
                                value={optimizerOptions[name]}
                                onInput={(e) => {
                                    setOptimizerOption(name, e.target.valueAsNumber)
                                }}
                            />
                        )}
                        {type === 'boolean' && (
                            <Select
                                value={optimizerOptions[name]}
                                key={name}
                                labelId={name}
                                onChange={(e) => {
                                    setOptimizerOption(name, e.target.value)
                                }}
                            >
                                <MenuItem value={true}>True</MenuItem>
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        )}
                    </FormControl>
                ))}
            </Row>
            <Row>
                <FormControl>
                    <InputLabel id={'Metric'}>{'Metric'}</InputLabel>
                    <Select
                        id="Metric"
                        label="Metric"
                        value={metric}
                        onChange={(e) => {
                            setMetric(e.target.value)
                        }}
                    >
                        {METRICS.map((value) => (
                            <MenuItem value={value} key={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id={'Loss'}>{'Loss'}</InputLabel>
                    <Select
                        id="Loss"
                        label="Loss"
                        value={loss}
                        onChange={(e) => {
                            setLoss(e.target.value)
                        }}
                    >
                        {LOSSES_FUNCTIONS.map((value) => (
                            <MenuItem value={value} key={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
