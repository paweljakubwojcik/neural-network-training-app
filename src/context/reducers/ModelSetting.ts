import type { Reducer } from 'react'
import type { ModelSettings, ReducerAction } from '../../types'
import {
    INCREMENT_LAYER_UNITS,
    DECREMENT_LAYER_UNITS,
    ADD_LAYER,
    REMOVE_LAYER,
    SET_ACTIVATION_FUNCTION,
} from '../actions/ModelSettings'

import { MIN_UNITS, MAX_UNITS, MAX_LAYERS, MIN_LAYERS } from '../../constants'

export const ModelSettingsReducer: Reducer<ModelSettings, ReducerAction> = (
    state,
    action
): ModelSettings => {
    const { type, payload: { layerName, newValue } = {} } = action

    const layerIndexToChange =
        layerName && state.layers.findIndex((layer) => layer.name === layerName)

    switch (type) {
        case INCREMENT_LAYER_UNITS:
            if (state.layers[layerIndexToChange].units >= MAX_UNITS) return state
            state.layers[layerIndexToChange].units++
            return { ...state }

        case DECREMENT_LAYER_UNITS:
            if (state.layers[layerIndexToChange].units <= MIN_UNITS) return state
            state.layers[layerIndexToChange].units--
            return { ...state }

        case ADD_LAYER:
            if (state.layers.length >= MAX_LAYERS) return state
            state.layers.splice(-1, 0, {
                name: `Hidden Layer ${state.layers.length - 1}`,
                units: 1,
                activationFunc: 'linear',
                adjustable: true,
            })
            return { ...state }

        case REMOVE_LAYER:
            if (state.layers.length <= MIN_LAYERS) return state
            state.layers.splice(-2, 1)
            return { ...state }

        case SET_ACTIVATION_FUNCTION:
            state.layers[layerIndexToChange].activationFunc = newValue
            return { ...state }

        default:
            break
    }

    return state
}
