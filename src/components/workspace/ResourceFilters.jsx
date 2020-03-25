import React, { useContext } from 'react';
import styled from '@emotion/styled';

import { WorkspaceContext } from 'utils/contexts';
import { VIEW_MODES } from 'utils/constants';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${colors.borderGrey}`,
}));

const ModeButton = styled.div(({ isSelected, theme: { colors } }) => ({
  borderBottom: isSelected ? `2px solid ${colors.mainText}` : 'none',
  borderTop: isSelected ? `2px solid ${colors.white}` : 'none',
  color: isSelected ? colors.mainText : colors.grey3,
  cursor: 'pointer',
  fontSize: '13px',
  height: '100%',
  letterSpacing: '-0.0025em',
  marginRight: '25px',
  padding: '0px 3px 2px',
}));

const ResourceFilters = () => {
  const { viewMode, setViewMode } = useContext(WorkspaceContext);

  const renderMode = (vm, i) => {
    const { mode, displayText } = vm;
    return (
      <ModeButton
        key={i}
        isSelected={viewMode === mode}
        onClick={() => setViewMode(mode)}
      >
        {displayText}
      </ModeButton>
    );
  };

  return <Container>{VIEW_MODES.map((vm, i) => renderMode(vm, i))}</Container>;
};

export default ResourceFilters;
