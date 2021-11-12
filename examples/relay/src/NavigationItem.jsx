import {graphql, useFragment} from "react-relay/hooks";
import styled from "styled-components";

// eslint-disable-next-line id-length
const A = styled.a`
  padding: 0 10px;
`;

export function NavigationItem(props) {
  const {displayText, url} = useFragment(
    graphql`
      fragment NavigationItem_config on NavigationItemConfig {
        id
        component
        displayText
        url
      }
    `,
    props.config
  );

  return <A href={url}>{displayText}</A>;
}
