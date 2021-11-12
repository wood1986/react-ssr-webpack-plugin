import {
  Environment,
  RecordSource,
  Store,
} from "relay-runtime";

export function createEnvironment({network, records = {}, isServer}) {
  return new Environment({
    network,
    "store": new Store(new RecordSource(records)),
    isServer,
  });
}
