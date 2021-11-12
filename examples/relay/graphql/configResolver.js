const database = require("./sample.json");

const resolveId = (id) => {
  const doc = database[id];
  return (doc && doc.isEnabled) ? {...doc, id} : null;
};

const resolveIds = (ids = []) => {
  return ids.map(resolveId).filter(Boolean);
};

module.exports.configResolver = {
  "Query": {
    configs(_obj, args, _context, _info) {
      return resolveIds(args.ids);
    },
    config(_obj, args, _context, _info) {
      return resolveId(args.id);
    },
  },
  "Config": {
    "__resolveType": (obj) => obj.type,
  },
  "NavigationItemConfig": {
    "configs": (obj) => resolveIds(obj.configs),
  },
  "NavigationConfig": {
    "configs": (obj) => resolveIds(obj.configs),
  },
  "HeaderConfig": {
    "configs": (obj) => resolveIds(obj.configs),
  },
  "PageConfig": {
    "configs": (obj) => resolveIds(obj.configs),
  },
};
