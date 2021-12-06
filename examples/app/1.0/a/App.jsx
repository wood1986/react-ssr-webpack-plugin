import styled, {createGlobalStyle} from "styled-components";
import {StrictMode} from "react";
import svg from "../../react.svg";

const DivWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  height: inherit;
  img {
    width: 96px;
    height: 96px;
  }
  code {
    font-size: .5em;
  }
`;

const GlobalStyle = createGlobalStyle`
  * {
    margin:0;
  }
  html, body, body>div {
    height:100%;
  }
`;

function Code(props) {
  return <code>
    name: {NAME}<br />
    query.version: {props.url.query.version}<br />
    json.__VERSION__: {props.__VERSION__}<br />
  </code>;
}

export function App(props) {
  return <StrictMode>
    <GlobalStyle />
    <DivWrapper>
      <img src={svg} />
      <Code {...props} />
    </DivWrapper>
  </StrictMode>;
}
