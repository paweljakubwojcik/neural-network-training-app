import React, { useRef, useCallback, useEffect, forwardRef } from 'react'

import { Chart, registerables } from 'chart.js'
import type { ChartOptions, ChartData, ChartType } from 'chart.js'

Chart.register(...registerables)

//TODO: add styling to improve responsivness
export interface ChartProps {
    data: ChartData
    options: ChartOptions
    type?: ChartType
    id: string
}

const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart: Chart) => {
        const ctx = chart.canvas.getContext('2d')!
        const color = '#fff'

        ctx.save()
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = color ? color : 'transparent'
        ctx.fillRect(0, 0, chart.width, chart.height)
        ctx.restore()
    },
}

/**
 * React Component wrapper for Chart.js , more on usage and props on: https://www.chartjs.org/docs/latest/
 *
 * default chart type is "scatter"
 */
export default forwardRef<HTMLCanvasElement, ChartProps>(function ChartComponent(
    { data, options, type = 'scatter', id, ...props },
    ref
) {
    const chartInstance = useRef<Chart>({
        update: () => {},
        destroy: () => {},
    } as Chart)

    if (!id) console.warn('id must be provided on chart component')

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.data = data
            chartInstance.current.update('normal')
        }
    }, [data])

    const canvasRef = useCallback<(instance: HTMLCanvasElement | null) => void>(
        (reference) => {
            chartInstance.current.destroy()

            if (reference) {
                const chart = new Chart(reference, {
                    type,
                    data,
                    options,
                    plugins: [plugin],
                })
                chartInstance.current = chart
            }
        },
        [data, options, type]
    )

    return <canvas ref={canvasRef} id={id}></canvas>
})

export { Chart }
