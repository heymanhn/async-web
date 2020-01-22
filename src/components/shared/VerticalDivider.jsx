import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Divider = styled.div(({ height, theme: { colors } }) => ({
  background: colors.borderGrey,
  height: `${height}px`,
  margin: '0 20px',
  width: '1px',
}));

const VerticalDivider = ({ height }) => <Divider height={height} />;

VerticalDivider.propTypes = { height: PropTypes.number };
VerticalDivider.defaultProps = { height: 24 };

export default VerticalDivider;
