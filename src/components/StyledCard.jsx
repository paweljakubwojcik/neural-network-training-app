import styled from 'styled-components'
import { Card } from '@material-ui/core'
import { MAX_DESKTOP } from '../styles'

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
    margin: 0.4em;
    width: 100%;

    max-width: 640px;
    position: relative;

    @media (min-width: ${MAX_DESKTOP}px) {
        max-width: 800px;
    }
`

export const StyledCardHeader = styled.header`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

StyledCard.Header = StyledCardHeader

export default StyledCard
