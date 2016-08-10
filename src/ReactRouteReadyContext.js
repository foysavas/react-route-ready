import React from 'react';
import getHookedComponents from './getHookedComponents';
import getHookedPromiseChain from './getHookedPromiseChain';

export default class ReactRouteReadyContext extends React.Component {
  static contextTypes = {
    store: React.PropTypes.object.isRequired
  }

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    components: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
  }

  static childContextTypes = {
    reactRouteReadyLoading: React.PropTypes.bool,
    reactRouteReadyComponentStatus: React.PropTypes.object
  }

  getChildContext() {
    return {
      reactRouteReadyLoading: this.state.loading,
      reactRouteReadyComponentStatus: this.state.componentStatus
    }
  }

  componentDidMount() {
    this.load(this.props.components, this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location === this.props.location) { return; }
    this.load(nextProps.components, nextProps);
  }

  load(components, props) {
    const locals = this.context.store ? {
      dispatch: this.context.store.dispatch,
      getState: this.context.store.getState,
    } : {};
    return getHookedPromiseChain(components, {
      locals,
      beforeAll: (components) => {
        const componentStatus = new Map();
        for (let component of components) {
          componentStatus.set(component, 'waiting');
        }
        this.setState({loading: true, componentStatus});
      },
      beforeEach: (component) => {
        const componentStatus = this.state.componentStatus;
        componentStatus.set(component, 'loading');
        this.setState({componentStatus});
      },
      afterEach: (component) => {
        const componentStatus = this.state.componentStatus;
        componentStatus.set(component, 'loaded');
        this.setState({componentStatus});
      },
      afterAll: (components) => {
        this.setState({loading: false});
      }
    })
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.state || {};
    this.state.componentStatus = new Map();
    this.state.loading = true;
  }

  render() {
    return this.props.children;
  }
}
