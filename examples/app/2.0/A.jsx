import {StrictMode, Suspense, lazy} from "react";
import styled, {createGlobalStyle, css} from "styled-components";

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
  ${css`
  * {
    margin:0;
  }
  html, body, body>div {
    height:100%;
  }`
}`;

// eslint-disable-next-line id-length
// const C = () => null;
// eslint-disable-next-line id-length
const C = lazy(() => import("./C"));

export function App(props) {
  return <StrictMode>
    <GlobalStyle />
    <DivWrapper>
      <Suspense fallback={<div>loading...</div>}>
        <C />
      </Suspense>
      <code>
        name: {NAME}<br />
        query.version: {props.version}<br />
        json.__VERSION__: {props.__VERSION__}<br />
      </code>
    </DivWrapper>
  </StrictMode>;
}
