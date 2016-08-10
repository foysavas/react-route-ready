import React from 'react';
import ReactRouteReadyContext from './ReactRouteReadyContext';

export default function useReactRouteReady() {
  return {
    renderRouterContext: (child, renderProps) => (
      <ReactRouteReadyContext {...renderProps}>{child}</ReactRouteReadyContext>
    )
  };
};
