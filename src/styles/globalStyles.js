import { createGlobalStyle } from 'styled-components'

/* variables are rewritten from the MaterialUI theme */

export const GlobalStyles = createGlobalStyle`

    * {
        box-sizing: border-box;
    }

    * :focus {
            outline: none;
    }

    html {
        /* CSS variables */
        --background-color: ${(props) => props.theme.palette.background.default};
        --secondary-font-color: ${(props) => props.theme.palette.text.secondary};
        --font-color:${(props) => props.theme.palette.text.primary};
        --primary-color: ${(props) => props.theme.palette.primary.main};
        --primary-color-light: ${(props) => props.theme.palette.primary.light};
        --primary-color-contrastText: ${(props) => props.theme.palette.primary.contrastText};
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
            "Droid Sans", "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        background-color: var(--background-color);
        color: var(--font-color);
        font-size: 16px;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
    }

    h1,
    h2,
    h3,
    h4,
    p {
        margin: 0;
    }

    a {
        text-decoration: none;
        cursor: pointer;
        color: inherit;
        display: inline-block;
        margin: 0;
    }

    button {
        border: none;
        outline: none;
    }

    button:active {
        outline: none;
        border: none;
    }

    input {
        border: none;
        outline: none;
    }

`
