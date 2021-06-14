import React, { useState } from 'react'
import styled from 'styled-components'
import ChartComponent, { ChartProps, Chart } from './Chart'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import IconButton from '@material-ui/core/IconButton'
// import SettingsIcon from '@material-ui/icons/Settings'

import ChartFullScreen from './ChartFullScreen'
import useChartData from '../hooks/useChartData'
// import useDeepEquality from '../hooks/useDeepEquality'

/* import Modal from '@material-ui/core/Modal'
import StyledCard from '../components/StyledCard'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import { Select, MenuItem, Input, InputLabel, FormControl } from '@material-ui/core' */

export interface ChartContainerProps extends ChartProps {
    title: string
}

export default function ChartContainer({
    title,
    data,
    options,
    type,
    id,
    xkeys,
    ykeys,
    ...props
}: ChartContainerProps) {
    const [modalOpen, setModaleOpen] = useState(false)
    // const [settingsOpen, setSettingsOpen] = useState(false)

    const chartData = useChartData(data)

    return (
        <>
            <Container {...props}>
                <Header>
                    {title && <h3>{title}</h3>}
                    {/*  <IconButton
                        size="small"
                        color="inherit"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => setSettingsOpen(true)}
                    >
                        <SettingsIcon />
                    </IconButton> */}
                    <IconButton
                        size="small"
                        color="inherit"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => setModaleOpen(true)}
                    >
                        <FullscreenIcon />
                    </IconButton>
                </Header>
                <ChartComponent
                    data={chartData}
                    options={options}
                    id={id}
                    type={type}
                    xkeys={xkeys}
                    ykeys={ykeys}
                />
            </Container>
            <ChartFullScreen
                title={title}
                data={chartData}
                options={options}
                id={id}
                open={modalOpen}
                type={type}
                onClose={() => setModaleOpen(false)}
                xkeys={xkeys}
                ykeys={ykeys}
            />
            {/*  <Modal
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 400,
                }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Fade in={settingsOpen} timeout={400}>
                    <StyledCard>
                        <Header>{title && <h2>{title} chart options</h2>}</Header>
                        <Select
                            labelId={'x'}
                            value={options.scales.x.title}
                            onChange={(e) => {
                                setOptimizer(e.target.value)
                            }}
                        >
                            {.map((value) => (
                                <MenuItem value={value} key={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </StyledCard>
                </Fade>
            </Modal> */}
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

const InvisibleButton = styled.button`
    opacity: 0;
    position: absolute;
    padding: 0;
    cursor: pointer;
`
