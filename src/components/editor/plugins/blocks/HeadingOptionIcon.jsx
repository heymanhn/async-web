import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Container = styled.div(({ number, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  color: colors.grey4,
  cursor: 'pointer',
  fontSize: number === 1 ? '18px' : '16px',
}));

const NumberDisplay = styled.span(({ number }) => ({
  fontSize: '10px',
  fontWeight: 600,

  position: 'relative',
  top: number === 1 ? '3px' : '2px',
  left: '1px',
}));

const HeadingOptionIcon = ({ number, ...props }) => (
  <Container number={number} {...props}>
    <FontAwesomeIcon icon={faHeading} />
    <NumberDisplay number={number}>{number}</NumberDisplay>
  </Container>
);

HeadingOptionIcon.propTypes = {
  number: PropTypes.number.isRequired,
};

export default HeadingOptionIcon;
