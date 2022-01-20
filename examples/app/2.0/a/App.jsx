import "../App.css";
import {Code, DivWrapper} from "../common";
import {StrictMode} from "react";
import styled from "styled-components";
import svg from "../../react.svg";

const DivWrapperA = styled(DivWrapper)`
  text-align: center;
`;

export function App(props) {
  return <StrictMode>
    <DivWrapperA flexDirection="column">
      <img src={svg} />
      <Code {...props} href={"b.node"} />
    </DivWrapperA>
  </StrictMode>;
}
