import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import CommandRow from './CommandRow';
import SearchRow from './SearchRow';

const Container = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: isSelected ? colors.grey7 : colors.bgGrey,
  cursor: 'pointer',
  padding: '15px 30px',
  userSelect: 'none',

  ':last-of-type': {
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
}));

const ResultRow = ({ data, isSelected, handleClose, ...props }) => {
  const { type, action } = data;

  const handleClick = event => {
    event.preventDefault();
    action();
    handleClose();
  };

  const Row = type === 'command' ? CommandRow : SearchRow;
  return (
    <Container isSelected={isSelected} onClick={handleClick} {...props}>
      <Row data={data} />
    </Container>
  );
};

ResultRow.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ResultRow;
