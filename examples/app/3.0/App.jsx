import {Code, DivWrapper, GlobalStyle, NotFound} from "./common";
import {Route, Routes} from "react-router-dom";
import {StrictMode, Suspense, lazy} from "react";
import svg from "../react.svg";

// eslint-disable-next-line id-length
const Img = lazy(() => import("./Img"));

export function App(props) {
  return <StrictMode>
    <GlobalStyle />
    <Routes>
      <Route path="a.node" element={
        <DivWrapper flexDirection="column" color="#d63384" align={"center"}>
          <Suspense fallback={<div>loading...</div>}>
            <Img />
          </Suspense>
          <Code {...props} to={"b.node"} />
        </DivWrapper>
      }/>
      <Route path="b.node" element={
        <DivWrapper flexDirection="row">
          <img src={svg} />
          <Code {...props} to={"a.node"} />
        </DivWrapper>
      }/>
      <Route path="/*" element={
        <NotFound />
      }/>
    </Routes>
  </StrictMode>;
}
