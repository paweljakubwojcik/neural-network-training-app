import styled, { StyledComponent } from 'styled-components'

type StyledComponentWithChildren = StyledComponent<'div', any, {}, never> & {
    Header?: StyledComponent<'h1', any, {}, never>
}

/**
 * layout flex container
 */
const Container = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-evenly;

    width: 100%;
    min-height: 100vh;
    padding: 1em;
`

const Column: StyledComponentWithChildren = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

Column.Header = styled.h1``

export { Container, Column }
