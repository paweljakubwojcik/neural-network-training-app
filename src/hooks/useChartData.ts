import { useState, useEffect } from 'react'
import type { ChartData } from 'chart.js'
import deepEqual from 'deep-equal'

// useDeepEquality but more specific
// might swap for more generic in the future

/**
 * updates data only when something changes according to deep equality
 *
 * normally react compares props with Object.is() algorithm,
 * which returns true only if compared objects are the same object in memory
 * for example {} === {} is false
 * deep equality on the other hand in example above qould return true because compared objects are composed from same values
 * */
export default function useChartData(data: ChartData) {
    const [chartData, setChartData] = useState<ChartData>(data)

    useEffect(() => {
        const shouldUpdate = !deepEqual(chartData.datasets, data.datasets)
        if (shouldUpdate) setChartData(data)
    }, [data, chartData])

    return chartData
}
