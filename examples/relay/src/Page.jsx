import {
  graphql,
  useFragment,
} from "react-relay/hooks";
import {Components} from "./components";

export function Page(props) {
  const {configs} = useFragment(
    graphql`
      fragment Page_config on PageConfig {
        configs {
          id
          component
          ...Header_config
        }
      }
    `,
    props.config
  );

  return <Components configs={configs} />;
}
