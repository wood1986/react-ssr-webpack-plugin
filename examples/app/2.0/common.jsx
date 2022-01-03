import styled, {createGlobalStyle} from "styled-components";

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
  * {
    margin:0;
  }
  html, body, body>div {
    height:100%;
  }
`;

export function Code(props) {
  return <code>
    name: {NAME}<br />
    server.url.href: {props.url.href}<br />
    __VERSION__: <a href={`${props.__VERSION__}.js`}>{props.__VERSION__}</a><br />
    <a href={`${props.href}${props.url.search || ""}`}>{props.href}</a>
  </code>;
}
