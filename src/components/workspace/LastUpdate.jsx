import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import { camelCaseObjString } from 'utils/helpers';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: '8px',
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
  flexGrow: 1,
}));

const LastUpdate = ({ notification, resourceType }) => {
  const { author, payload, type } = notification;
  const { id, fullName, profilePictureUrl } = author;
  const { userId } = getLocalUser();
  const isAuthor = userId === id;

  const snippetForEvent = eventType => {
    switch (eventType) {
      case 'edit_document':
        return `made edits`;
      case 'resolve_discussion':
        return 'resolved this discussion';
      case 'edit_discussion':
        return 'updated the discussion title';
      default:
        return `added this ${resourceType}`;
    }
  };

  const generateSnippet = () => {
    let authorName = isAuthor ? 'You' : fullName;
    const payloadObj = camelCaseObjString(payload);
    let { snippet } = payloadObj;
    if (snippet) {
      authorName += ':';
    } else {
      snippet = snippetForEvent(type);
    }

    return { authorName, snippet };
  };

  const { authorName, snippet } = generateSnippet();

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

LastUpdate.propTypes = {
  notification: PropTypes.object.isRequired,
  resourceType: PropTypes.string.isRequired,
};

export default LastUpdate;
