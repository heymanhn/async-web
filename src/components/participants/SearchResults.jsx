import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ResultRow from './ResultRow';

const Container = styled.div(({ theme: { colors } }) => ({
  position: 'absolute',
  top: '41px',
  left: '-10px',

  backgroundColor: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  height: 'auto',
  maxHeight: '240px', // Equivalent to 4 results
  overflow: 'auto',
  width: '420px',
}));

const SearchResults = ({
  handleAddSelection,
  currentMembers,
  parentWorkspaceId,
  results,
  selectedIndex,
  updateSelectedIndex,
}) => {
  if (!results.length) return null;

  const disabledCheck = result => {
    const { type } = result;
    if (type === 'member')
      return !!currentMembers.find(({ id }) => id === result.id);
    if (type === 'workspace') return !!parentWorkspaceId;

    return false;
  };

  return (
    <Container onClick={e => e.stopPropagation()}>
      {results.map((result, i) => (
        <ResultRow
          key={result.id}
          handleAddSelection={handleAddSelection}
          index={i}
          isDisabled={disabledCheck(result)}
          isSelected={selectedIndex === i}
          result={result}
          updateSelectedIndex={updateSelectedIndex}
        />
      ))}
    </Container>
  );
};

SearchResults.propTypes = {
  handleAddSelection: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  currentMembers: PropTypes.array.isRequired,
  parentWorkspaceId: PropTypes.string,
  selectedIndex: PropTypes.number.isRequired,
  updateSelectedIndex: PropTypes.func.isRequired,
};

SearchResults.defaultProps = {
  parentWorkspaceId: null,
};

export default SearchResults;
