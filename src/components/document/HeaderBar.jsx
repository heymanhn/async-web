import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsAlt, faFileAlt } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import documentQuery from 'graphql/queries/document';
import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import DropdownMenu from 'components/navigation/DropdownMenu';
import NewDocumentButton from './NewDocumentButton';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  background: colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '54px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

const MenuSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginLeft: '30px',
});

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
  marginRight: '15px',
});

const DocumentTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  position: 'relative',
  top: '2px',
}));

const NavigationSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});

// HN: Dry these two up later
const ContentModeButton = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  background: colors.white,
  borderLeft: `1px solid ${colors.borderGrey}`,
  borderRight: `1px solid ${colors.borderGrey}`,
  borderBottom: isSelected ? `3px solid ${colors.blue}` : 'none',
  borderTop: isSelected ? `3px solid ${colors.white}` : 'none',
  cursor: 'pointer',
  height: '100%',
  width: '70px',
}));

const DiscussionsModeButton = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  background: colors.white,
  borderRight: `1px solid ${colors.borderGrey}`,
  borderBottom: isSelected ? `3px solid ${colors.blue}` : 'none',
  borderTop: isSelected ? `3px solid ${colors.white}` : 'none',
  cursor: 'pointer',
  height: '100%',
  width: '70px',
}));

const StyledDocumentIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '20px',

  ':hover': {
    color: colors.grey1,
  },
}));

const StyledDiscussionsIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '18px',

  ':hover': {
    color: colors.grey1,
  },
}));

const HeaderBar = ({ documentId, setViewMode, viewMode, ...props }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function openDropdown() { setIsDropdownOpen(true); }
  function closeDropdown() { setIsDropdownOpen(false); }

  const { organizationId } = getLocalAppState();
  const [getOrganization, { data }] = useLazyQuery(organizationQuery, {
    variables: { id: organizationId },
  });

  const [getDocument, { error, data: documentData }] = useLazyQuery(documentQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (!organizationId) return null;
  if (organizationId && !data) {
    getOrganization();
    return null;
  }
  if (documentId && !documentData) {
    getDocument();
    return null;
  }
  if (error || !documentData.document || !data.organization) return null;

  const { logo } = data.organization;
  const { title } = documentData.document;

  return (
    <Container {...props}>
      <MenuSection>
        <OrganizationAvatar
          avatarUrl={logo}
          onClick={openDropdown}
          size={24}
          square
        />
        <DropdownMenu
          handleClose={closeDropdown}
          isOpen={isDropdownOpen}
          organizationId={organizationId}
        />
        <DocumentTitle>{title || 'Untitled Document'}</DocumentTitle>
      </MenuSection>
      <NavigationSection>
        <ContentModeButton
          isSelected={viewMode === 'content'}
          onClick={() => setViewMode('content')}
        >
          <StyledDocumentIcon icon={faFileAlt} />
        </ContentModeButton>
        <DiscussionsModeButton
          isSelected={viewMode === 'discussions'}
          onClick={() => setViewMode('discussions')}
        >
          <StyledDiscussionsIcon icon={faCommentsAlt} />
        </DiscussionsModeButton>
        <NewDocumentButton />
      </NavigationSection>
    </Container>
  );
};

HeaderBar.propTypes = {
  documentId: PropTypes.string.isRequired,
  setViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['content', 'discussions']).isRequired,
};

export default HeaderBar;
