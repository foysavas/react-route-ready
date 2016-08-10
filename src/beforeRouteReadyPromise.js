import * as names from './names';

export default function beforeRouteReadyPromise(loader) {
  return (Component) => {
    Component[names.hook] = loader;
    return Component;
  };
}
