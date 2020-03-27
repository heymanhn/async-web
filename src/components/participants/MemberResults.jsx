import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import MemberRow from './MemberRow';

const Container = styled.div(({ theme: { colors } }) => ({
  position: 'absolute',
  top: '41px',

  backgroundColor: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
  height: 'auto',
  maxHeight: '240px', // Equivalent to 4 results
  overflow: 'auto',
  width: '100%',
}));

const MemberResults = ({
  handleAddSelection,
  members,
  results,
  selectedIndex,
  updateSelectedIndex,
}) =>
  results.length ? (
    <Container onClick={e => e.stopPropagation()}>
      {results.map((result, i) => (
        <MemberRow
          key={result.id}
          handleAddSelection={handleAddSelection}
          index={i}
          isMember={!!members.find(({ id }) => id === result.id)}
          isSelected={selectedIndex === i}
          member={result}
          updateSelectedIndex={updateSelectedIndex}
        />
      ))}
    </Container>
  ) : null;

MemberResults.propTypes = {
  handleAddSelection: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  members: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  updateSelectedIndex: PropTypes.func.isRequired,
};

export default MemberResults;
