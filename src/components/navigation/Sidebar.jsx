import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import organizationQuery from 'graphql/queries/organization';
import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.darkBlue,
  width: '250px',
}));

const OrganizationDisplay = styled.div({
  display: 'flex',
  flexDirection: 'row',

  margin: '25px 20px 0',
});

const OrganizationLogo = styled(Avatar)({
  marginRight: '15px',
});

const OrganizationTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.bgGrey,
  fontSize: '16px',
  fontWeight: 500,
}));

const Sidebar = () => {
  const { organizationId } = getLocalUser();
  const { loading, data } = useQuery(organizationQuery, {
    variables: { id: organizationId },
  });

  if (loading || !data.organization) return null;
  const { logo, title } = data.organization;

  return (
    <Container>
      <OrganizationDisplay>
        <OrganizationLogo
          size={24}
          square
          src={logo}
        />
        <OrganizationTitle>{title}</OrganizationTitle>
      </OrganizationDisplay>
    </Container>
  );
};

export default Sidebar;
