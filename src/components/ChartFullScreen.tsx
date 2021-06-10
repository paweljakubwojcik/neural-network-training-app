import React from 'react'
import styled from 'styled-components'

import ChartComponent, { Chart } from '../components/Chart'
import { ChartContainerProps } from './ChartContainer'

import Modal, { ModalProps } from '@material-ui/core/Modal'
import StyledCard from '../components/StyledCard'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import { Button } from '@material-ui/core'

interface ChartFullScreenProps extends Pick<ModalProps, 'open' | 'onClose'>, ChartContainerProps {
    id: string
}

export default function ChartFullScreen({
    id,
    open,
    onClose,
    title,
    options,
    data,
    type,
}: ChartFullScreenProps) {
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
        <StyledModal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 400,
            }}
        >
            <Fade in={open} timeout={400}>
                <ModalCard>
                    <Header>{title && <h2>{title}</h2>}</Header>
                    <ChartComponent data={data} options={options} id={MODAL_CHART_ID} type={type} />
                    <Button variant="contained" color="primary" onClick={() => downloadPicture()}>
                        Download Image
                    </Button>
                </ModalCard>
            </Fade>
        </StyledModal>
    )
}

const ModalCard = styled(StyledCard)`
    max-width: unset;
    width: 80vw;
`

const StyledModal = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;
`
const Header = styled.header`
    display: flex;
    width: 100%;
`
