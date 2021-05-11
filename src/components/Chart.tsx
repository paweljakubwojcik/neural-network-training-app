import { useState, useCallback, useEffect } from 'react'
import { Chart, registerables } from 'chart.js'

import type { ChartOptions, ChartData, ChartType, ScatterDataPoint } from 'chart.js'

Chart.register(...registerables)

interface ChartProps {
    data: ChartData
    options: ChartOptions
    type?: ChartType
}

/**
 * React Component wrapper for Chart.js , more on usage and props on: https://www.chartjs.org/docs/latest/
 *
 * default chart type is "scatter"
 */
export default function ChartComponent({ data, options, type = 'scatter', ...props }: ChartProps) {
    const [chart, setChart] = useState<Chart>({
        update: () => {},
        destroy: () => {},
    } as Chart)

    useEffect(() => {
        chart.data = data
        chart.options = options

        chart.update('normal')
    }, [data, options])

    const canvasRef = useCallback<(instance: HTMLCanvasElement | null) => void>((reference) => {
        chart.destroy()

        if (reference) {
            setChart(
                new Chart(reference, {
                    type,
                    data,
                    options,
                })
            )
        }
    }, [])

    return <canvas ref={canvasRef} {...props}></canvas>
}
