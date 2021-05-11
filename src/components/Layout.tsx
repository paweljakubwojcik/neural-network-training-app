import styled, { StyledComponent } from 'styled-components'

type Row = StyledComponent<'div', any, {}, never> & { Header?: StyledComponent<'h1', any> }

const Container = styled.div`
    display: flex;
    width: 100%;
    min-height: 100vh;
    align-items: stretch;
    justify-content: space-evenly;
    padding: 1em;
`

const Row: Row = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

Row.Header = styled.h1``

export { Container, Row }
