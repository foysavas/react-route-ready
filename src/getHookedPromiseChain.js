import getHookedComponents from './getHookedComponents';

export default function getHookedPromiseChain(components, {locals, beforeAll, beforeEach, afterEach, afterAll}) {
  let promiseChain = Promise.resolve();
  if (beforeAll) { promiseChain = promiseChain.then(() => (beforeAll(components))); }
  promiseChain = getHookedComponents(components).reduce((promiseChain, {component, hook}) => {
    if (beforeEach) { promiseChain = promiseChain.then(() => (beforeEach(component))); }
    if (hook) { promiseChain = promiseChain.then(() => (hook(locals))); }
    if (afterEach) { promiseChain = promiseChain.then(() => (afterEach(component))); }
    return promiseChain;
  }, Promise.resolve());
  if (afterAll) { promiseChain = promiseChain.then(() => (afterAll(components))); }
  return promiseChain;
}
