import {
  RelayEnvironmentProvider,
  graphql,
  useLazyLoadQuery,
} from "react-relay/hooks";
import {
  createGlobalStyle,
  css,
} from "styled-components";
import {Component} from "./components";
import {Suspense} from "react";

const GlobalStyle = createGlobalStyle`
  ${css`
  * {
    margin: 0;
  }
  html, body, body>div {
    height: 100%;
    font-family: sans-serif;
  }`
}`;

function Root(props) {
  const {config} = useLazyLoadQuery(
    graphql`
      query RootQuery($id: ID!) {
        config(id: $id) {
          id
          component
          ...Page_config
        }
      }
    `,
    props.variables,
    {
      "fetchPolicy": "store-or-network",
    }
  );

  if (config) {
    return <Component config={config} />;
  }
  return <></>;
}

export function App(props) {
  return <RelayEnvironmentProvider environment={props.environment}>
    <Suspense fallback={"loading..."}>
      <GlobalStyle />
      <Root variables={props.variables}/>
    </Suspense>
  </RelayEnvironmentProvider>;
}
