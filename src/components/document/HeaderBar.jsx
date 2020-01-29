import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentsAlt,
  faFileAlt,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useQuery } from '@apollo/react-hooks';

import documentQuery from 'graphql/queries/document';
import organizationQuery from 'graphql/queries/organization';
import documentNotificationsQuery from 'graphql/queries/documentNotifications';

import { getLocalAppState } from 'utils/auth';

import DocumentAccessContainer from 'components/participants/DocumentAccessContainer';
import Avatar from 'components/shared/Avatar';
import VerticalDivider from 'components/shared/VerticalDivider';
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
  alignItems: 'center',
  marginLeft: '30px',
  height: '100%',
});

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
  marginRight: '15px',
});

const DocumentTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
  position: 'relative',
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

const BadgeCountIcon = styled.span(({ theme: { colors } }) => ({
  color: colors.white,
  background: colors.blue,
  borderRadius: '10px',
  fontSize: '12px',
  height: '19px',
  padding: '0 8px',
  position: 'absolute',
  marginTop: '-10px',
  marginLeft: '10px',
  fontWeight: 500,
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

const HeaderBar = ({ documentId, setViewMode, viewMode, ...props }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function openDropdown() {
    setIsDropdownOpen(true);
  }
  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  const { organizationId } = getLocalAppState();

  const { loading: loadingOrg, data: organizationData } = useQuery(
    organizationQuery,
    {
      variables: { id: organizationId },
    }
  );

  const { loading: loadingDoc, data: documentData } = useQuery(documentQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  const { loading, data: notificationsData } = useQuery(
    documentNotificationsQuery,
    {
      variables: { id: documentId },
    }
  );

  if (!organizationId) return null;
  if (loadingOrg || !organizationData.organization) return null;
  if (loadingDoc || !documentData.document) return null;
  if (loading || !notificationsData.documentNotifications) return null;

  const { logo } = organizationData.organization;
  const { title } = documentData.document;
  const { notifications } = notificationsData.documentNotifications;

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
            {notifications && notifications.length > 0 ? (
              <BadgeCountIcon>{notifications.length}</BadgeCountIcon>
            ) : (
              <StyledPlusIcon icon={faPlus} />
            )}
          </DiscussionsIconContainer>
        </DiscussionModeButton>
        <VerticalDivider />
        <DocumentAccessContainer documentId={documentId} />
      </MenuSection>
      <NavigationSection>
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
