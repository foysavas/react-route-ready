import React from 'react';

export default function beforeRouteReadyRender(renderer) {
  return (Component) => {
    Component.contextTypes = Object.assign(Component.contextTypes, {
      reactRouteReadyLoading: React.PropTypes.bool.isRequired,
      reactRouteReadyLoaded: React.PropTypes.bool.isRequired,
      reactRouteReadyComponentStatus: React.PropTypes.object.isRequired
    })
    const __render = Component.prototype.render;
    Component.prototype.render = function() {
      const routeComponent = this.props.route.component;
      const compStatus = this.context.reactRouteReadyComponentStatus.get(routeComponent);
      const wasRouteLoaded = this.context.reactRouteReadyLoaded;
      const isRouteLoading = this.context.reactRouteReadyLoading;
      const isStarting = !isRouteLoading && !wasRouteLoaded;
      const isCompLoading = isRouteLoading && (compStatus === "queued" || compStatus === "loading");
      if (isStarting || isCompLoading) {
        return React.createElement(renderer);
      } else {
        return __render.apply(this);
      }
    }
    return Component;
  };
}
