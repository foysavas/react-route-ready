import * as names from './names';

export default function beforeRouteReadyPromise(test) {
  return (Component) => {
    Component[names.shouldRouteReload] = test;
    return Component;
  };
}
