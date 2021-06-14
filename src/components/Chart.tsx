import React, { useRef, useCallback, useEffect, forwardRef, useState } from 'react'
import styled from 'styled-components'

import { Chart, registerables } from 'chart.js'
import type { ChartOptions, ChartData, ChartType } from 'chart.js'
import PopMenu from './PopMenu'

Chart.register(...registerables)
export interface ChartProps {
    data: ChartData
    options: ChartOptions
    type?: ChartType
    id: string
    xkeys?: string[]
    ykeys?: string[]
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
    { data, options, type = 'scatter', id, ykeys, xkeys, ...props },
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

    const [xAxisKey, setXAxisKey] = useState<string>()
    const [yAxisKey, setYAxisKey] = useState<string>()

    useEffect(() => {
        if (xkeys && xkeys.length) setXAxisKey(xkeys[xkeys?.length - 1])
    }, [xkeys])

    useEffect(() => {
        if (ykeys && ykeys.length) setYAxisKey(ykeys[ykeys?.length - 1])
    }, [ykeys])

    const [xOptions, setXOptions] = useState(false)
    const [yOptions, setYOptions] = useState(false)
    const xButton = useRef(null)
    const yButton = useRef(null)

    const canvasRef = useCallback<(instance: HTMLCanvasElement | null) => void>(
        (reference) => {
            chartInstance.current.destroy()

            if (reference) {
                const chart = new Chart(reference, {
                    type,
                    data,
                    options: {
                        parsing: {
                            xAxisKey,
                            yAxisKey,
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: xAxisKey,
                                    font: {
                                        size: 10,
                                    },
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: yAxisKey,
                                    font: {
                                        size: 10,
                                    },
                                },
                            },
                        },
                        ...options,
                    },
                    plugins: [plugin],
                })
                chartInstance.current = chart
            }
        },
        [data, options, type, xAxisKey, yAxisKey]
    )

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {ykeys && ykeys?.length > 1 && (
                <>
                    <InvisibleButton
                        style={{ width: '2em', height: '80%', left: 0, top: 0 }}
                        ref={yButton}
                        onClick={() => setYOptions(true)}
                    ></InvisibleButton>
                    <PopMenu
                        anchorEl={yButton.current}
                        onChange={(v) => setYAxisKey(v)}
                        value={yAxisKey}
                        handleClose={() => setYOptions(false)}
                        options={ykeys}
                        open={yOptions}
                    />
                </>
            )}
            {xkeys && xkeys?.length > 1 && (
                <>
                    <InvisibleButton
                        style={{ width: '80%', height: '2em', right: 0, bottom: 0 }}
                        ref={xButton}
                        onClick={() => setXOptions(true)}
                    ></InvisibleButton>
                    <PopMenu
                        anchorEl={xButton.current}
                        onChange={(v) => setXAxisKey(v)}
                        value={xAxisKey}
                        handleClose={() => setXOptions(false)}
                        options={xkeys}
                        open={xOptions}
                    />
                </>
            )}
            <canvas ref={canvasRef} id={id}></canvas>
        </div>
    )
})

const InvisibleButton = styled.button`
    opacity: 0;
    position: absolute;
    padding: 0;
    cursor: pointer;
`

export { Chart }
