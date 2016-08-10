import * as names from './names';

export default function getHookedComponents(components){
  return (Array.isArray(components) ? components : [components])
    .filter(component => component)
    .map(component => ({component, hook: component[names.hook]}))
    .filter(({hook}) => hook);
}
