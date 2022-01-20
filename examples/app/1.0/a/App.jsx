import "./App.css";
import {StrictMode} from "react";
import styled from "styled-components";
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

function Code(props) {
  return <code>
    name: {NAME}<br />
    server.url.href: {props.url.href}<br />
    __VERSION__: <a href={`${__webpack_public_path__}${props.__VERSION__}.js`}>{props.__VERSION__}</a><br />
  </code>;
}

export function App(props) {
  return <StrictMode>
    <DivWrapper>
      <img src={svg} />
      <Code {...props} />
    </DivWrapper>
  </StrictMode>;
}
