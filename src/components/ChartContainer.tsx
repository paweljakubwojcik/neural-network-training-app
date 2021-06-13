import React, { useState } from 'react'
import styled from 'styled-components'
import ChartComponent, { ChartProps, Chart } from './Chart'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import IconButton from '@material-ui/core/IconButton'
import ChartFullScreen from './ChartFullScreen'
import useChartData from '../hooks/useChartData'

export interface ChartContainerProps extends ChartProps {
    title: string
}

export default function ChartContainer({
    title,
    data,
    options,
    type,
    id,
    ...props
}: ChartContainerProps) {
    const [modalOpen, setModaleOpen] = useState(false)

   /*  const chartData = useChartData(data) */
    const chartData = data

    return (
        <>
            <Container {...props}>
                <Header>
                    {title && <h3>{title}</h3>}
                    <IconButton
                        size="small"
                        color="inherit"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => setModaleOpen(true)}
                    >
                        <FullscreenIcon />
                    </IconButton>
                </Header>
                <ChartComponent data={chartData} options={options} id={id} type={type} />
            </Container>
            <ChartFullScreen
                title={title}
                data={chartData}
                options={options}
                id={id}
                open={modalOpen}
                type={type}
                onClose={() => setModaleOpen(false)}
            />
        </>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0.5em;
    /*  align-items: center; */

    color: var(--secondary-font-color);
`

const Header = styled.header`
    display: flex;
    width: 100%;
`
