import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #343a40;
    line-height: 1.6;
  }
`;

export default GlobalStyle;
