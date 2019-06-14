import React, { Component } from 'react';

const getDisplayName = C => C.displayName || C.name || 'Component';

// Used on any top level page that we need to run a page() Segment call on
const withPageTracking = (WrappedComponent, pageTitle) => {
  class WithPageTracking extends Component {
    componentDidMount() {
      window.analytics.page(pageTitle);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  WithPageTracking.displayName = `WithPageTracking(${getDisplayName(WrappedComponent)})`;
  return WithPageTracking;
};

export default withPageTracking;
