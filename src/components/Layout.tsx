import styled, { StyledComponent } from 'styled-components'

/**
 * layout flex container
 */
const Container = styled.div`
    display: grid;

    grid-template-columns: repeat(3, 1fr);
    grid-template-areas: 'model training evaulation';

    align-items: stretch;
    justify-items: stretch;

    width: 100%;
    min-height: 100vh;
    padding: 1em;

    @media (max-width: 1700px) {
        grid-template-areas:
            'model training'
            'model evaulation';
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 1100px) {
        grid-template-areas:
            'model'
            'training'
            'evaulation';
        grid-template-columns: repeat(1, 1fr);
    }
`

const Column: StyledComponent<'div', any, {}, never> & {
    Header?: StyledComponent<'h1', any, {}, never>
} = styled.div<{ gridName: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    /* flex-grow: 1; */
    /* max-width: 700px; */
    padding: 0.4em;
    grid-area: ${(props) => props.gridName};
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;
    justify-content: space-evenly;

    margin: 0.5em;
    width: 100%;
`

Column.Header = styled.h1`
    display: block;
    width: 100%;
`

export { Container, Column, Row }
