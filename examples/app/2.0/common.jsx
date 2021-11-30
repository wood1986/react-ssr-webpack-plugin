import styled, {createGlobalStyle, css} from "styled-components";

export const DivWrapper = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection};
  font-family: sans-serif;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  height: inherit;
  img {
    width: 96px;
    height: 96px;
    margin: .5rem;
  }
  code {
    font-size: .5em;
    margin: .5rem;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${css`
  * {
    margin:0;
  }
  html, body, body>div {
    height:100%;
  }`
}`;

export function Code(props) {
  return <code>
    name: {NAME}<br />
    query.version: {props.query.version}<br />
    json.__VERSION__: {props.__VERSION__}<br />
    <a href={props.href}>{props.href}</a>
  </code>;
}