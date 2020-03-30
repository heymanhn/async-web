import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import MemberResult from './MemberResult';
import WorkspaceResult from './WorkspaceResult';

const Container = styled.div(
  ({ isDisabled, isSelected, theme: { colors } }) => ({
    display: 'flex',
    alignItems: 'center',
    background: isSelected ? colors.grey7 : 'none',
    cursor: isDisabled ? 'default' : 'pointer',
    margin: '7px 0',
    padding: '3px 25px',
    userSelect: 'none',

    ':hover': {
      background: colors.grey7,
    },
  })
);

const ResultRow = ({
  handleAddSelection,
  index,
  isDisabled,
  isSelected,
  result,
  updateSelectedIndex,
  ...props
}) => {
  const resultRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      // the options argument is not supported in IE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  const handleClick = () => {
    return isDisabled ? null : handleAddSelection(result);
  };

  const { type } = result;
  const RowType = type === 'workspace' ? WorkspaceResult : MemberResult;

  return (
    <Container
      isDisabled={isDisabled}
      isSelected={isSelected}
      onClick={handleClick}
      onMouseOver={() => updateSelectedIndex(index)}
      onFocus={() => updateSelectedIndex(index)}
      ref={resultRef}
      {...props}
    >
      <RowType result={result} isDisabled={isDisabled} />
    </Container>
  );
};

ResultRow.propTypes = {
  handleAddSelection: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  result: PropTypes.object.isRequired,
  updateSelectedIndex: PropTypes.func.isRequired,
};

export default ResultRow;
