import React from 'react';
import PropTypes from 'prop-types';
import getHookedComponents from './getHookedComponents';
import getHookedPromiseChain from './getHookedPromiseChain';
import getUnreadyComponents from './getUnreadyComponents';

export default class ReactRouteReadyContext extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    components: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  static childContextTypes = {
    reactRouteReadyLoading: PropTypes.bool,
    reactRouteReadyLoaded: PropTypes.bool,
    reactRouteReadyComponentStatus: PropTypes.object
  }

  getChildContext() {
    return {
      reactRouteReadyLoading: this.state.loading,
      reactRouteReadyLoaded: this.state.loaded,
      reactRouteReadyComponentStatus: this.state.componentStatus
    }
  }

  componentDidMount() {
    this.load(this.props.components, this.props);
    this.setStateIfMounted = this.setState;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location === this.props.location) { return; }
    const unreadyComponents = getUnreadyComponents(this.props,nextProps);
    this.load(unreadyComponents, nextProps);
  }

  componentWillUnmount() {
    this.setStateIfMounted = function noop(){};
  }

  load(components, props) {
    const locals = this.context.store ? {
      params: props.params,
      location: props.location,
      dispatch: this.context.store.dispatch,
      getState: this.context.store.getState,
    } : {
      params: props.params,
      location: props.location,
    };

    const componentStatus = new Map();
    for (let component of components) { componentStatus.set(component, 'queued'); }
    this.setState({loading: true, componentStatus});

    return getHookedPromiseChain(components, {
      locals,
      beforeAll: (components) => {},
      beforeEach: (component) => {
        const componentStatus = this.state.componentStatus;
        componentStatus.set(component, 'loading');
        if (this.props.location === props.location) {
          this.setStateIfMounted({componentStatus});
        }
      },
      afterEach: (component) => {
        const componentStatus = this.state.componentStatus;
        componentStatus.set(component, 'loaded');
        if (this.props.location === props.location) {
          this.setStateIfMounted({componentStatus});
        }
      },
      afterAll: (components) => {
        if (this.props.location === props.location) {
          this.setStateIfMounted({loading: false, loaded: true});
        }
      }
    })
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.state || {};
    this.state.componentStatus = new Map();
    this.state.loading = false;
    this.state.loaded = false;
  }

  render() {
    return this.props.children;
  }
}
