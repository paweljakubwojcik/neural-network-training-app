import { useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { Chart, registerables } from 'chart.js'
import type { ChartOptions, ChartData, ChartType, ScatterDataPoint } from 'chart.js'

Chart.register(...registerables)

//TODO: add styling to improve responsivness
interface ChartProps {
    data: ChartData
    options: ChartOptions
    type?: ChartType
    title: string
}

/**
 * React Component wrapper for Chart.js , more on usage and props on: https://www.chartjs.org/docs/latest/
 *
 * default chart type is "scatter"
 */
export default function ChartComponent({
    data,
    options,
    type = 'scatter',
    title,
    ...props
}: ChartProps) {
    const chartInstance = useRef<Chart>({
        update: () => {},
        destroy: () => {},
    } as Chart)

    useEffect(() => {
        chartInstance.current.data = data
        chartInstance.current.options = options
        chartInstance.current.update('normal')
    }, [data, options])

    const canvasRef = useCallback<(instance: HTMLCanvasElement | null) => void>(
        (reference) => {
            chartInstance.current.destroy()

            if (reference) {
                chartInstance.current = new Chart(reference, {
                    type,
                    data,
                    options,
                })
            }
        },
        [data, options, type]
    )

    return (
        <Container {...props}>
            <h3>{title}</h3>
            <canvas ref={canvasRef} id={title}></canvas>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5em;
`
