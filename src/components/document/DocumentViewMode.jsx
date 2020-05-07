import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';

import VerticalDivider from 'components/shared/VerticalDivider';

const ModeButton = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderBottom: isSelected ? `3px solid ${colors.blue}` : 'none',
  borderTop: isSelected ? `3px solid ${colors.white}` : 'none',
  cursor: 'pointer',
  height: '100%',
  width: '30px',
  marginRight: '15px',
  paddingBottom: '5px',
}));

const DiscussionsIconContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  ':hover': {
    color: colors.grey1,
  },
}));

const StyledDocumentIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '18px',

  ':hover': {
    color: colors.grey1,
  },
}));

const StyledDiscussionsIcon = styled(FontAwesomeIcon)(
  ({ theme: { colors } }) => ({
    color: colors.grey2,
    fontSize: '18px',
  })
);

const StyledPlusIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '12px',
  marginLeft: '-3px',
  marginTop: '-20px',
}));

const DocumentViewMode = () => {
  // TODO (HN): replace this extra UI with the redesigned document conversations
  // UX in the future
  const { viewMode, setViewMode } = useContext(DocumentContext);

  return (
    <>
      <VerticalDivider />
      <ModeButton
        isSelected={viewMode === 'content'}
        onClick={() => setViewMode('content')}
      >
        <StyledDocumentIcon icon="file-alt" />
      </ModeButton>
      <ModeButton
        isSelected={viewMode === 'threads'}
        onClick={() => setViewMode('threads')}
      >
        <DiscussionsIconContainer>
          <StyledDiscussionsIcon icon="comments-alt" />
          <StyledPlusIcon icon="plus" />
        </DiscussionsIconContainer>
      </ModeButton>
    </>
  );
};

export default DocumentViewMode;
