import React, { Component } from 'react';

const getDisplayName = C => C.displayName || C.name || 'Component';

/*
 * Passes a `hover` prop to the wrapped component for any necessary
 * UI rendering.
 *
 * Also passes event handlers for hover state. Components that use this HOC
 * need to propagate these event handler props to their top level wrapping element
 */
const withHover = (WrappedComponent) => {
  class WithHover extends Component {
    constructor(props) {
      super(props);

      this.state = { hover: false };
      this.toggleHover = this.toggleHover.bind(this);
    }

    toggleHover() {
      this.setState(prevState => ({ hover: !prevState.hover }));
    }

    render() {
      const { hover } = this.state;

      return (
        <WrappedComponent
          onBlur={this.toggleHover}
          onFocus={this.toggleHover}
          onMouseOut={this.toggleHover}
          onMouseOver={this.toggleHover}
          hover={hover}
          {...this.props}
        />
      );
    }
  }

  WithHover.displayName = `WithHover(${getDisplayName(WrappedComponent)})`;
  return WithHover;
};

export default withHover;
