/* eslint-disable sort-imports */

export const components = {};

import {Page} from "./Page";
components["Page"] = Page;

import {Header} from "./Header";
components["Header"] = Header;

import {Navigation} from "./Navigation";
components["Navigation"] = Navigation;

import {NavigationItem} from "./NavigationItem";
components["NavigationItem"] = NavigationItem;

export function Component(props) {
  /* eslint-disable-next-line id-length */
  const C = components[props.config.component];
  return <C {...props} />;
}

export function Components(props) {
  const {configs, ...restProps} = props;
  return configs.map((config, index) => <Component key={index} index={index} config={config} {...restProps} />);
}
