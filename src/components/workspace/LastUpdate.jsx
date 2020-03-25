import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import camelCase from 'camelcase';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: '10px',
});

const StyledAvatar = styled(Avatar)({
  flexShrink: 0,
  marginRight: '8px',
});

const Name = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.0025em',
  marginRight: '5px',
  flexShrink: 0,
}));

const Snippet = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '13px',
  letterSpacing: '-0.0025em',
}));

const LastUpdate = ({ notification }) => {
  const { author, payload } = notification;
  const { id, fullName, profilePictureUrl } = author;
  const { userId } = getLocalUser();
  const isAuthor = userId === id;
  const authorName = isAuthor ? 'You' : fullName;

  const payloadJSON = JSON.parse(payload);
  const payloadCamelJSON = {};
  Object.keys(payloadJSON).forEach(key => {
    payloadCamelJSON[camelCase(key)] = payloadJSON[key];
  });
  const { snippet } = payloadCamelJSON;

  return (
    <Container>
      <StyledAvatar
        avatarUrl={profilePictureUrl}
        title={fullName}
        alt={fullName}
        size={20}
      />
      <Name>{authorName}</Name>
      <Snippet>
        <Truncate lines={1}>{snippet}</Truncate>
      </Snippet>
    </Container>
  );
};

LastUpdate.propTypes = { notification: PropTypes.object.isRequired };

export default LastUpdate;
