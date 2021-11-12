import {graphql, useFragment} from "react-relay/hooks";
import {Components} from "./components";

export function Header(props) {
  const {configs} = useFragment(
    graphql`
      fragment Header_config on HeaderConfig {
        configs {
          id
          component
          ...Navigation_config
        }
      }
    `,
    props.config
  );

  return <Components configs={configs} />;
}
