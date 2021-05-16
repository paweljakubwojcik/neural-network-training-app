import styled, { StyledComponent } from 'styled-components'

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

const Column: StyledComponent<'div', any, {}, never> & {
    Header?: StyledComponent<'h1', any, {}, never>
} = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    max-width: 650px;
    padding: 0.4em;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;

    width: 100%;
`

Column.Header = styled.h1`
    display: block;
    width: 100%;
`

export { Container, Column, Row }
