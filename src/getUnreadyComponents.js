import * as names from './names';

export default function getUnreadyComponents(props, nextProps) {
  if (!props || !props.components) { return nextProps.components; }

  let unreadyComponents = [];

  const compLength = props.components.length;
  const nextCompLength = nextProps.components.length;
  let hasSeenDifferent = false;

  for (let i = 0; i < nextCompLength; i++) {
    const possibleNextComp = nextProps.components[i];
    if (!hasSeenDifferent) {
      if (i >= compLength) {
        hasSeenDifferent = true;
      } else {
        if (possibleNextComp === props.components[i]) {
          if (possibleNextComp) {
            const customShouldRouteReload = possibleNextComp[names.shouldRouteReload];
            if (customShouldRouteReload && customShouldRouteReload(props,nextProps)) {
              hasSeenDifferent = true;
            }
          }
        } else {
          hasSeenDifferent = true;
        }
      }
    }
    if (hasSeenDifferent) {
      unreadyComponents.push(possibleNextComp);
    }
  }

  return unreadyComponents;
}
