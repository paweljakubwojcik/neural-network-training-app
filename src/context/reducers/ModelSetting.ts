import type { Reducer } from 'react'
import {
    INCREMENT_LAYER_UNITS,
    DECREMENT_LAYER_UNITS,
    ADD_LAYER,
    REMOVE_LAYER,
    SET_ACTIVATION_FUNCTION,
    SET_OPTIMAZER,
} from '../actions/ModelSettings'

import { MIN_UNITS, MAX_UNITS, MAX_LAYERS, MIN_LAYERS } from '../../constants'

import type { Optimizer, ModelCompileArgs } from '@tensorflow/tfjs'
import { train } from '@tensorflow/tfjs'

type OptimizerConstructor = () => Optimizer
export interface ModelSettings {
    layers: [
        {
            name: string
            units: number
            activationFunc: string | undefined
            adjustable: boolean
        }
    ]
    optimizer: OptimizerConstructor
    optimazerOptions: any
    loss: ModelCompileArgs['loss']
}

export type ReducerAction = {
    type: string
    payload?: {
        layerName?: string
        newValue?: string
        newOptimazer?: keyof typeof train
    }
}

export const ModelSettingsReducer: Reducer<ModelSettings, ReducerAction> = (
    state,
    action
): ModelSettings => {
    const { type, payload: { layerName, newValue = '', newOptimazer = 'sgd' } = {} } = action

    const layerToChange = state.layers.find((layer) => layer.name === layerName)!

    switch (type) {
        case INCREMENT_LAYER_UNITS:
            if (layerToChange.units >= MAX_UNITS) return state
            layerToChange.units++
            return { ...state }

        case DECREMENT_LAYER_UNITS:
            if (layerToChange.units <= MIN_UNITS) return state
            layerToChange.units--
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
            layerToChange.activationFunc = newValue
            return { ...state }

        case SET_OPTIMAZER:
            console.log(newOptimazer)

            return { ...state, optimizer: train[newOptimazer] as OptimizerConstructor }

        default:
            break
    }

    return state
}
