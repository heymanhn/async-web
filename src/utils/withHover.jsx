import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      this.disableHover = this.disableHover.bind(this);
      this.enableHover = this.enableHover.bind(this);
    }

    disableHover(event) {
      event.stopPropagation();
      const { noHover } = this.props;
      if (!noHover) this.setState({ hover: false });
    }

    enableHover(event) {
      event.stopPropagation();
      const { noHover } = this.props;
      if (!noHover) this.setState({ hover: true });
    }

    render() {
      const { hover } = this.state;
      const { noHover } = this.props;

      return noHover ? <WrappedComponent {...this.props} /> : (
        <WrappedComponent
          onBlur={this.disableHover}
          onFocus={this.enableHover}
          onMouseOut={this.disableHover}
          onMouseOver={this.enableHover}
          hover={hover}
          {...this.props}
        />
      );
    }
  }

  WithHover.propTypes = {
    noHover: PropTypes.bool,
  };

  WithHover.defaultProps = {
    noHover: false,
  };

  WithHover.displayName = `WithHover(${getDisplayName(WrappedComponent)})`;
  return WithHover;
};

export default withHover;
