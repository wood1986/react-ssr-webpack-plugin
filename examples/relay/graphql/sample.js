const {customAlphabet} = require("nanoid");
/* eslint-disable-next-line no-magic-numbers */
const nanoid = customAlphabet("0123456789abcdefghjkmnpqrstvwxyz", 8);

const navigationItems = {
  "ipad": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "iPad",
      "url": "//apple.com/ipad",
    },
  },
  "iphone": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "iPhone",
      "url": "//apple.com/iphone",
    },
  },
  "mac": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "Mac",
      "url": "//apple.com/mac",
    },
  },
  "watch": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "Watch",
      "url": "//apple.com/watch",
    },
  },
  "tv": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": false,
      "configs": [],
      "displayText": "TV",
      "url": "//apple.com/tv",
    },
  },
  "ca.ipad": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "iPad",
      "url": "//apple.com/ca/ipad",
    },
  },
  "ca.iphone": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": false,
      "configs": [],
      "displayText": "iPhone",
      "url": "//apple.com/ca/iphone",
    },
  },
  "ca.mac": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "Mac",
      "url": "//apple.com/ca/mac",
    },
  },
  "ca.tv": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "TV",
      "url": "//apple.com/ca/tv",
    },
  },
  "ca.watch": {
    [nanoid()]: {
      "type": "NavigationItemConfig",
      "component": "NavigationItem",
      "isEnabled": true,
      "configs": [],
      "displayText": "Watch",
      "url": "//apple.com/ca/watch",
    },
  },
};

const navigations = {
  "en-us": {
    [nanoid()]: {
      "type": "NavigationConfig",
      "component": "Navigation",
      "isEnabled": true,
      "configs": [
        Object.keys(navigationItems["mac"])[0],
        Object.keys(navigationItems["ipad"])[0],
        Object.keys(navigationItems["iphone"])[0],
        Object.keys(navigationItems["watch"])[0],
        Object.keys(navigationItems["tv"])[0],
      ],
    },
  },
  "en-ca": {
    [nanoid()]: {
      "type": "NavigationConfig",
      "component": "Navigation",
      "isEnabled": true,
      "configs": [
        Object.keys(navigationItems["ca.mac"])[0],
        Object.keys(navigationItems["ca.iphone"])[0],
      ],
    },
  },
};

const headers = {
  "en-us": {
    [nanoid()]: {
      "type": "HeaderConfig",
      "component": "Header",
      "isEnabled": true,
      "configs": [Object.keys(navigations["en-us"])[0]],
    },
  },
  "en-ca": {
    [nanoid()]: {
      "type": "HeaderConfig",
      "component": "Header",
      "isEnabled": false,
      "configs": [Object.keys(navigations["en-ca"])[0]],
    },
  },
};

const db = {
  ...navigationItems["ca.mac"],
  ...navigationItems["ca.ipad"],
  ...navigationItems["ca.iphone"],
  ...navigationItems["ca.tv"],
  ...navigationItems["ca.watch"],
  ...navigationItems["mac"],
  ...navigationItems["ipad"],
  ...navigationItems["iphone"],
  ...navigationItems["tv"],
  ...navigationItems["watch"],
  ...navigations["en-us"],
  ...navigations["en-ca"],
  ...headers["en-us"],
  ...headers["en-ca"],
  [nanoid()]: {
    "type": "PageConfig",
    "component": "Page",
    "isEnabled": true,
    "configs": [Object.keys(headers["en-us"])[0]],
  },
  [nanoid()]: {
    "type": "PageConfig",
    "component": "Page",
    "isEnabled": true,
    "configs": [Object.keys(headers["en-ca"])[0]],
  },
};

/* eslint-disable-next-line no-magic-numbers, no-console */
console.log(JSON.stringify(db, null, 2));
