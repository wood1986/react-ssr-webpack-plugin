import {graphql, useFragment} from "react-relay/hooks";
import {Components} from "./components";
import styled from "styled-components";

const Div = styled.div`
  width: 980px;
  margin: 0 auto;
  display: flex;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export function Navigation(props) {
  const {configs} = useFragment(
    graphql`
      fragment Navigation_config on NavigationConfig {
        configs {
          id
          component
          ...NavigationItem_config
        }
      }
    `,
    props.config
  );

  return <Div>
    <Components configs={configs} />
  </Div>;
}
