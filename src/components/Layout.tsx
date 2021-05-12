import styled, { StyledComponent } from 'styled-components'

type StyledComponentWithChildren = StyledComponent<'div', any, {}, never> & {
    Header?: StyledComponent<'h1', any, {}, never>
}

/**
 * layout flex container
 */
const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
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
    flex-grow: 1;
    max-width: 650px;
    padding: 0.4em;
`

Column.Header = styled.h1`
    display: block;
    width: 100%;
`

export { Container, Column }
