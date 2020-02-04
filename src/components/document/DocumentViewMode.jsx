import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentsAlt,
  faFileAlt,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import VerticalDivider from 'components/shared/VerticalDivider';

const ContentModeButton = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderBottom: isSelected ? `3px solid ${colors.blue}` : 'none',
  borderTop: isSelected ? `3px solid ${colors.white}` : 'none',
  cursor: 'pointer',
  height: '100%',
  width: '30px',
  marginRight: '15px',
}));

const DiscussionModeButton = styled.div(
  ({ isSelected, theme: { colors } }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderBottom: isSelected ? `3px solid ${colors.blue}` : 'none',
    borderTop: isSelected ? `3px solid ${colors.white}` : 'none',
    cursor: 'pointer',
    height: '100%',
    width: '30px',
  })
);

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

const DocumentViewMode = ({ setViewMode, viewMode }) => {
  return (
    <>
      <VerticalDivider />
      <ContentModeButton
        isSelected={viewMode === 'content'}
        onClick={() => setViewMode('content')}
      >
        <StyledDocumentIcon icon={faFileAlt} />
      </ContentModeButton>
      <DiscussionModeButton
        isSelected={viewMode === 'discussions'}
        onClick={() => setViewMode('discussions')}
      >
        <DiscussionsIconContainer>
          <StyledDiscussionsIcon icon={faCommentsAlt} />
          <StyledPlusIcon icon={faPlus} />
        </DiscussionsIconContainer>
      </DiscussionModeButton>
    </>
  );
};

DocumentViewMode.propTypes = {
  setViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['content', 'discussions']).isRequired,
};

export default DocumentViewMode;
