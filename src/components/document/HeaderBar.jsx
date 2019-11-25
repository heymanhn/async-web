import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

  background: colors.headerBarGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '54px',
  padding: '0 30px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

// const BackButton = styled.div(({ theme: { colors } }) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   cursor: 'pointer',
//   color: colors.grey4,

//   ':hover': {
//     color: colors.grey3,
//   },
// }));

const OrganizationAvatar = styled(Avatar)({
  cursor: 'pointer',
  marginRight: '15px',
});

const DocumentTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
}));

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
