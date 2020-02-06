import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Container = styled.div(({ isActive, number, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  color: isActive ? colors.selectedValueBlue : colors.bgGrey,
  cursor: 'pointer',
  fontSize: number === 2 ? '12px' : 'initial',
  margin: '5px 10px',

  position: number === 2 ? 'relative' : 'initial',
  top: number === 2 ? '2px' : '0',

  ':hover': {
    color: colors.selectedValueBlue,
  },
}));

const NumberDisplay = styled.span(({ number }) => ({
  fontSize: '10px',
  fontWeight: 600,

  position: 'relative',
  top: number === 1 ? '3px' : '1px',
  left: '1px',
}));

const HeadingIcon = ({ isActive, number, ...props }) => (
  <Container isActive={isActive} number={number} {...props}>
    <FontAwesomeIcon icon={faHeading} />
    <NumberDisplay number={number}>{number}</NumberDisplay>
  </Container>
);

HeadingIcon.propTypes = {
  isActive: PropTypes.bool,
  number: PropTypes.number.isRequired,
};

HeadingIcon.defaultProps = {
  isActive: false,
};

export default HeadingIcon;
