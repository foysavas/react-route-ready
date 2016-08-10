# react-route-ready

Before hooks for react components using `react-router`.

## Installation

### 1. Add Middleware to React Router

```
import { useReactRouteReady } from 'react-route-ready';

// ...

render(<Provider store={store}>
  <Router render={(props) => (applyRouterMiddleware(useReactRouteReady))}>
    {routes}
  </Router>
</Provider>, document.getElementById('root'))
```

### 2. Add Decorators to Route components

```
import LoadingSpinner from './components/LoadingSpinner';

@beforeRouteReadyRender(LoadingSpinner)
@beforeRouteReadyPromise(({params, dispatch, getState})  => {
  return Promise.all([
    dispatch(getAccountSettings()),
    dispatch(getSomePageData()),
  ]);
})
class SomePage extends Component {
  // ...
}
```

Nested route components will load sequentially and display the component passed into `@beforeReadyRender` until ready.
