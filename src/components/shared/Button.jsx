import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

import styled from '@emotion/styled/macro';

const Container = styled.div(({ isDisabled }) => ({
  flexShrink: 0,
  borderRadius: '5px',
  cursor: isDisabled ? 'default' : 'pointer',
  display: 'inline-block',
  fontWeight: 500,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  padding: '9px 25px 10px',
  userSelect: 'none',

  opacity: isDisabled ? 0.5 : 1,
}));

const StyledSpinner = styled(Spinner)(({ title }) => ({
  margin: `0 ${Math.floor((title.length * 5) / 2)}px`,
}));

const BlueContainer = styled(Container)(({ theme: { colors } }) => ({
  backgroundColor: colors.blue,
  color: colors.white,

  [StyledSpinner]: {
    border: `.08em solid ${colors.white}`,
    borderRightColor: 'transparent',
  },
}));

const LightContainer = styled(Container)(({ theme: { colors } }) => ({
  border: `1px solid ${colors.blue}`,
  backgroundColor: colors.white,
  color: colors.blue,

  [StyledSpinner]: {
    border: `.08em solid ${colors.blue}`,
    borderRightColor: 'transparent',
  },
}));

const GreyContainer = styled(Container)(({ theme: { colors } }) => ({
  border: `1px solid ${colors.grey6}`,
  backgroundColor: colors.white,
  color: colors.grey3,
}));

const getButtonType = type => {
  if (type === 'light') return LightContainer;
  if (type === 'grey') return GreyContainer;

  return BlueContainer;
};

const Button = ({ type, title, loading, ...props }) => {
  const ButtonType = getButtonType(type);

  return (
    <ButtonType {...props}>
      {loading ? <StyledSpinner size="sm" title={title} /> : title}
    </ButtonType>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['blue', 'light', 'grey']),
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  type: 'blue',
  loading: false,
};

export default Button;
