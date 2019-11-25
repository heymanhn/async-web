import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import organizationQuery from 'graphql/queries/organization';
import { getLocalAppState } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import DropdownMenu from 'components/navigation/DropdownMenu';

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
}));

const NewDocumentButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  color: colors.grey2,
  height: '28px',
  padding: '0 15px',
}));

const StyledPlus = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
  marginRight: '8px',
}));

const ButtonTitle = styled.div({
  fontSize: '12px',
  fontWeight: 500,
});

const HeaderBar = ({ documentTitle, ...props }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  function openDropdown() { setIsDropdownOpen(true); }
  function closeDropdown() { setIsDropdownOpen(false); }

  const { organizationId } = getLocalAppState();
  const [getOrganization, { loading, data }] = useLazyQuery(organizationQuery, {
    variables: { id: organizationId },
  });

  if (!organizationId) return null;
  if (organizationId && !data) {
    getOrganization();
    return null;
  }

  if (loading || !data.organization) return null;
  const { logo } = data.organization;

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
        <DocumentTitle>{documentTitle}</DocumentTitle>
      </MenuSection>
      <NewDocumentButton>
        <StyledPlus icon={faPlus} />
        <ButtonTitle>New Document</ButtonTitle>
      </NewDocumentButton>
    </Container>
  );
};

HeaderBar.propTypes = {
  documentTitle: PropTypes.string,
};

HeaderBar.defaultProps = {
  documentTitle: 'Untitled Document',
};

export default HeaderBar;
