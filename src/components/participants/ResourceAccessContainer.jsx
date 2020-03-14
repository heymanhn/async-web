import React, { useContext } from 'react';
import styled from '@emotion/styled';

import { NavContext } from 'utils/contexts';

import ResourceAccessModal from './ResourceAccessModal';

const InviteButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.grey3}`,
  borderRadius: '5px',
  color: colors.grey1,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  height: '28px',
  padding: '0 15px',
}));

const ResourceAccessContainer = () => {
  const {
    isResourceAccessModalOpen,
    setIsResourceAccessModalOpen,
  } = useContext(NavContext);

  return (
    <>
      <InviteButton onClick={() => setIsResourceAccessModalOpen(true)}>
        Invite
      </InviteButton>
      <ResourceAccessModal
        handleClose={() => setIsResourceAccessModalOpen(false)}
        isOpen={isResourceAccessModalOpen}
      />
    </>
  );
};

export default ResourceAccessContainer;
