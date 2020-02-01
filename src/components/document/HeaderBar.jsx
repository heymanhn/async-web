import React, { useContext, useState } from 'react';
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
import notificationsQuery from 'graphql/queries/notifications';
import { getLocalAppState, getLocalUser } from 'utils/auth';
import { DocumentContext } from 'utils/contexts';

import DocumentAccessContainer from 'components/participants/DocumentAccessContainer';
import Avatar from 'components/shared/Avatar';
import VerticalDivider from 'components/shared/VerticalDivider';
import DropdownMenu from 'components/navigation/DropdownMenu';
import NotificationsBell from 'components/notifications/NotificationsBell';
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

const HeaderBar = ({ setViewMode, viewMode, ...props }) => {
  const { documentId } = useContext(DocumentContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function openDropdown() {
    setIsDropdownOpen(true);
  }
  function closeDropdown() {
    setIsDropdownOpen(false);
  }

  const { organizationId } = getLocalAppState();
  const { userId } = getLocalUser();

  const { loading: loadingOrg, data: organizationData } = useQuery(
    organizationQuery,
    {
      variables: { id: organizationId },
    }
  );

  const { loading: loadingDoc, data: documentData } = useQuery(documentQuery, {
    variables: { documentId, queryParams: {} },
  });

  const { loading, data: notificationsData } = useQuery(notificationsQuery, {
    variables: { id: userId },
  });

  if (!organizationId) return null;
  if (loadingOrg || !organizationData.organization) return null;
  if (loadingDoc || !documentData.document) return null;
  if (loading || !notificationsData.userNotifications) return null;

  const { logo } = organizationData.organization;
  const { title } = documentData.document;
  const { notifications } = notificationsData.userNotifications;

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
            <StyledPlusIcon icon={faPlus} />
          </DiscussionsIconContainer>
        </DiscussionModeButton>
        <VerticalDivider />
        <DocumentAccessContainer documentId={documentId} />
      </MenuSection>
      <NavigationSection>
        <NotificationsBell notifications={notifications} />
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
