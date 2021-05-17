import { useContext } from 'react'
import styled from 'styled-components'
import { Card, Button, Select, MenuItem } from '@material-ui/core'
import AddBoxIcon from '@material-ui/icons/AddBox'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CounterControl from './CounterControl'
import { TensorflowContext } from '../context/Tensorflow'

import { MIN_UNITS, MAX_UNITS, MAX_LAYERS, MIN_LAYERS } from '../constants'

const activationFunctions = ['linear', 'relu']

export default function LayersControls() {
    const {
        modelSettings: { layers },
        incrementLayerUnits,
        decrementLayerUnits,
        addLayer,
        setActivationFunction,
        removeLayer,
    } = useContext(TensorflowContext)

    const LayersControls = layers.map((layer, i) => (
        <LayerControl key={i}>
            <div style={{ marginRight: 'auto' }}>{layer.name}</div>
            <Select
                labelId={`${layer.name} activation function`}
                value={layer.activation}
                onChange={(e) => setActivationFunction(layer.name, e.target.value)}
            >
                {activationFunctions.map((func) => (
                    <MenuItem value={func} key={func}>
                        {func}
                    </MenuItem>
                ))}
            </Select>
            {layer.adjustable && (
                <CounterControl
                    count={layer.units}
                    up={() => incrementLayerUnits(layer.name)}
                    down={() => decrementLayerUnits(layer.name)}
                    max={MAX_UNITS}
                    min={MIN_UNITS}
                />
            )}
        </LayerControl>
    ))

    return (
        <Container>
            <Title>Layers: </Title>
            {LayersControls.slice(0, -1)}
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button
                    startIcon={<AddBoxIcon />}
                    onClick={addLayer}
                    disabled={layers.length >= MAX_LAYERS}
                >
                    Add Layer
                </Button>
                <Button
                    startIcon={<RemoveCircleIcon />}
                    onClick={removeLayer}
                    disabled={layers.length <= MIN_LAYERS}
                >
                    Remove Layer
                </Button>
            </div>

            {LayersControls.slice(-1)}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
`

const Title = styled.h3`
    color: var(--secondary-font-color);
    display: block;
    width: 100%;
`

const LayerControl = styled(Card)`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0.3em;
    padding: 0.3em;
    border-radius: 100px;
`
