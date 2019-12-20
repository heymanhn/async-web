import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

  background: colors.headerBarGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '54px',
  padding: '0 30px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

const MenuSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
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

const HeaderBar = ({ documentId, ...props }) => {
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
      <NewDocumentButton />
    </Container>
  );
};

HeaderBar.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default HeaderBar;
