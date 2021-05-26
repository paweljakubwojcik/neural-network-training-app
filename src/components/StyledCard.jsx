import styled from 'styled-components'
import { Card } from '@material-ui/core'

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
    margin: 0.4em;
    width: 100%;

    max-width: 600px;
    position: relative;
`

StyledCard.Header = styled.header`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

export default StyledCard
