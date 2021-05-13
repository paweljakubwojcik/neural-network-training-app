import styled from 'styled-components'

const WIDTH = 300
const HEIGHT = 200

interface NetworkDiagramProps {
    layers: [number]
}

type Point = {
    x: number
    y: number
}

/**
 * Component to visualize structure of a neural network
 * prop layers is an array of numbers where every number represents number of nodes in the leyer
 * @example layers = [1,2,1]
 */
export default function NetworkDiagram({ layers, ...props }: NetworkDiagramProps) {
    const nodes: Point[][] = layers.map((numberOfNodes, j) => {
        const step_x = WIDTH / (layers.length + 1)
        return new Array(numberOfNodes).fill(0).map((zero, i) => {
            const step_y = HEIGHT / (numberOfNodes + 1)
            return { y: step_y * (i + 1), x: step_x * (j + 1) }
        })
    })

    const lines: { start: Point; end: Point }[] = nodes
        .map((node, i) => {
            if (i === 0) return []
            const current = node
            const prev = nodes[i - 1]
            let lines: { start: Point; end: Point }[] = []
            current.forEach(({ x: x1, y: y1 }) => {
                prev.forEach(({ x: x2, y: y2 }) => {
                    lines.push({
                        start: { x: x1, y: y1 },
                        end: { x: x2, y: y2 },
                    })
                })
            })
            return lines
        })
        .reduce((prev, curr) => (prev ? [...prev, ...curr] : curr), [])

    return (
        <Container {...props}>
            <svg style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
                {lines.map(({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 } }, i) => (
                    <Line x1={x1} y1={y1} x2={x2} y2={y2} key={i} />
                ))}
            </svg>
            {nodes
                .reduce((prev, curr) => [...prev, ...curr], [])
                .map(({ x, y }, i) => (
                    <Circle style={{ top: y + 'px', left: x + 'px' }} key={i} />
                ))}
        </Container>
    )
}

const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
`

const Circle = styled.div`
    display: block;
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #3f50b5;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    transform: translate(-50%, -50%);
`

const Line = styled.line`
    stroke: var(--secondary-font-color);
    stroke-width: 3px;
    opacity: 0.6;
`
