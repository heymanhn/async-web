import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import resourceMembersQuery from 'graphql/queries/resourceMembers';
import { getLocalAppState } from 'utils/auth';
import { NavigationContext } from 'utils/contexts';

import ResourceAccessModal from './ResourceAccessModal';

const ShareButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: colors.altBlue,
  borderRadius: '5px',
  color: colors.white,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  height: '30px',
  marginTop: '-1px',
  padding: '0 12px',
}));

const ButtonText = styled.div({
  marginRight: '15px',
});

const MemberCountDisplay = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const MemberIcon = styled(FontAwesomeIcon)({
  fontSize: '11px',
});

const MemberCount = styled.div({
  marginLeft: '4px',
});

const ResourceAccessContainer = () => {
  const {
    resource: { resourceType, resourceId },
    isResourceAccessModalOpen,
    setIsResourceAccessModalOpen,
  } = useContext(NavigationContext);

  // Prefetch the data so that the input field loads at the same time as the
  // participants list
  const { organizationId: id } = getLocalAppState();
  useQuery(resourceMembersQuery, {
    variables: {
      resourceType: 'organizations',
      resourceId: id,
    },
  });

  // TODO (HN): Include number of workspaces in the count later
  const { data } = useQuery(resourceMembersQuery, {
    variables: { resourceType, resourceId },
    fetchPolicy: 'cache-and-network',
  });

  if (!data || !data.resourceMembers) return null;
  const { members } = data.resourceMembers;
  const participants = members || [];

  return (
    <>
      <ShareButton onClick={() => setIsResourceAccessModalOpen(true)}>
        <ButtonText>Share</ButtonText>
        <MemberCountDisplay>
          <MemberIcon icon="user" />
          <MemberCount>{participants.length}</MemberCount>
        </MemberCountDisplay>
      </ShareButton>
      <ResourceAccessModal
        handleClose={() => setIsResourceAccessModalOpen(false)}
        isOpen={isResourceAccessModalOpen}
        participants={participants}
      />
    </>
  );
};

export default ResourceAccessContainer;
