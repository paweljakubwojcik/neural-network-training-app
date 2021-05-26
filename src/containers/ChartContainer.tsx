import React, { useState } from 'react'
import styled from 'styled-components'
import ChartComponent, { ChartProps, Chart } from '../components/Chart'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import IconButton from '@material-ui/core/IconButton'

import Modal from '@material-ui/core/Modal'
import StyledCard from '../components/StyledCard'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import { Button } from '@material-ui/core'

interface ChartContainerProps extends ChartProps {
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

    const MODAL_CHART_ID = `${id}-modal`

    const downloadPicture = () => {
        const chart = Chart.getChart(MODAL_CHART_ID)
        const image = chart!.toBase64Image('image/jpeg')

        const downloadLink = document.createElement('a')
        downloadLink.href = image!
        downloadLink.download = title
        downloadLink.click()
    }

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
                <ChartComponent data={data} options={options} id={id} type={type} />
            </Container>
            <StyledModal
                open={modalOpen}
                onClose={() => setModaleOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 400,
                }}
            >
                <Fade in={modalOpen} timeout={400}>
                    <ModalCard>
                        <Header>{title && <h2>{title}</h2>}</Header>
                        <ChartComponent
                            data={data}
                            options={options}
                            id={MODAL_CHART_ID}
                            type={type}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => downloadPicture()}
                        >
                            Download Image
                        </Button>
                    </ModalCard>
                </Fade>
            </StyledModal>
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

const ModalCard = styled(StyledCard)`
    max-width: unset;
    width: 80vw;
`

const StyledModal = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;
`
