import "../App.css";
import {Code, DivWrapper} from "../common";
import {StrictMode, Suspense, lazy} from "react";
import styled from "styled-components";

const DivWrapperB = styled(DivWrapper)`
  img {
    margin: .5rem;
  }
  code {
    margin: .5rem;
  }
`;

// eslint-disable-next-line id-length
const Img = lazy(() => import("./Img"));

export function App(props) {
  return <StrictMode>
    <DivWrapperB flexDirection="row">
      <Suspense fallback={<div>loading...</div>}>
        <Img />
      </Suspense>
      <Code {...props} href={"a.node"} />
    </DivWrapperB>
  </StrictMode>;
}
