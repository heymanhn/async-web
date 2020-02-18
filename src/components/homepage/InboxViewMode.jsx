import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const ModeButton = styled.div(({ isSelected, theme: { colors } }) => ({
  borderBottom: isSelected ? `2px solid ${colors.mainText}` : 'none',
  borderTop: isSelected ? `2px solid ${colors.white}` : 'none',
  color: isSelected ? colors.mainText : colors.grey3,
  fontSize: '12px',
  cursor: 'pointer',
  height: '100%',
  marginRight: '25px',
}));

const InboxViewMode = ({ setViewMode, viewMode }) => {
  return (
    <Container>
      <ModeButton
        isSelected={viewMode === 'all'}
        onClick={() => setViewMode('all')}
      >
        All
      </ModeButton>
      <ModeButton
        isSelected={viewMode === 'document'}
        onClick={() => setViewMode('document')}
      >
        Documents
      </ModeButton>
      <ModeButton
        isSelected={viewMode === 'discussion'}
        onClick={() => setViewMode('discussion')}
      >
        Discussions
      </ModeButton>
    </Container>
  );
};

InboxViewMode.propTypes = {
  setViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['all', 'document', 'discussion']).isRequired,
};

export default InboxViewMode;
