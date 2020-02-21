import React from 'react';
import PropTypes from 'prop-types';

import CommandRow from './CommandRow';
import SearchRow from './SearchRow';

const ResultRow = ({ data, handleClose, ...props }) => {
  const { type, action } = data;

  const handleClick = event => {
    event.preventDefault();
    action();
    handleClose();
  };

  const Row = type === 'command' ? CommandRow : ResultRow;
  return <Row data={data} onClick={handleClick} {...props} />;
};

ResultRow.propTypes = {
  data: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ResultRow;
