import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getLocalAppState } from 'utils/auth';

// TEMPORARY: For hiding emails from demo orgs
import { DEMO_ORG_IDS } from 'utils/constants';

import Avatar from 'components/shared/Avatar';

const StyledAvatar = styled(Avatar)(({ isDisabled }) => ({
  flexShrink: 0,
  marginRight: '10px',
  opacity: isDisabled ? 0.5 : 1,
}));

const Details = styled.div(({ theme: { fontProps } }) =>
  fontProps({ size: 14 })
);

const Name = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: isDisabled ? colors.grey4 : colors.grey0,
  fontWeight: isDisabled ? 500 : 600,
}));

const Email = styled.div(({ isDisabled, theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 13 }),
  color: isDisabled ? colors.grey4 : colors.grey2,
}));

const MemberResult = ({ result, isDisabled }) => {
  const { organizationId } = getLocalAppState();
  const isDemoOrg = organizationId === DEMO_ORG_IDS[process.env.NODE_ENV];
  const { email, fullName, profilePictureUrl } = result;

  return (
    <>
      <StyledAvatar
        alt={fullName}
        avatarUrl={profilePictureUrl}
        isDisabled={isDisabled}
        size={30}
        title={fullName}
      />
      <Details>
        <Name isDisabled={isDisabled}>
          {`${fullName}${isDisabled ? ' (joined)' : ''}`}
        </Name>
        {!isDemoOrg && <Email isDisabled={isDisabled}>{email}</Email>}
      </Details>
    </>
  );
};

MemberResult.propTypes = {
  result: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default MemberResult;
