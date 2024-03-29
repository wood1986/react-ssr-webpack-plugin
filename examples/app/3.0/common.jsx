import {createContext, createRef, useContext} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import styles from "./Code.css";
import {useLocation} from "react-router";

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
    text-align: ${props => props.align};
    font-size: .5em;
    margin: .5rem;
  }
`;

export function Code(props) {
  const location = useLocation();
  return <code className={styles.code}>
    name: {NAME}<br />
    server.url.href: {props.url.href}<br />
    __VERSION__: <a href={`${__webpack_public_path__}${props.__VERSION__}.js`}>{props.__VERSION__}</a><br />
    <Link to={`/${props.to}${location.search || ""}`}>{props.to}</Link>
  </code>;
}

const Pre = styled.pre`
  font-family: monospace;
  font-size: initial;
  padding: 13px 8px;
  line-height: initial;
`;

export const StatusCodeContext = createContext(createRef());

export function NotFound() {
  const statusCode = useContext(StatusCodeContext);
  const location = useLocation();
  statusCode.current = 404;
  return <Pre>
    Cannot GET {`${location.pathname}${location.search}`}
  </Pre>;
}
