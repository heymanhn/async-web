import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import {
  DOCUMENT_EDIT_EVENT,
  DISCUSSION_EDIT_EVENT,
  DISCUSSION_RESOLVE_EVENT,
} from 'utils/constants';
import { camelCaseObjString } from 'utils/helpers';
import { TruncatedSingleLine } from 'styles/shared';

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

const Name = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 13, weight: 500 }),
  color: colors.grey0,
  marginRight: '5px',
  flexShrink: 0,
}));

const Snippet = styled(TruncatedSingleLine)(
  ({ theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 13 }),
    color: colors.grey2,
    flexGrow: 1,
  })
);

const LastUpdate = ({ notification, resourceType }) => {
  const { author, payload, type } = notification;
  const { id, fullName, profilePictureUrl } = author;
  const { userId } = getLocalUser();
  const isAuthor = userId === id;

  const snippetForEvent = eventType => {
    switch (eventType) {
      case DOCUMENT_EDIT_EVENT:
        return `made edits`;
      case DISCUSSION_RESOLVE_EVENT:
        return 'resolved this discussion';
      case DISCUSSION_EDIT_EVENT:
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
      <Snippet>{snippet}</Snippet>
    </Container>
  );
};

LastUpdate.propTypes = {
  notification: PropTypes.object.isRequired,
  resourceType: PropTypes.string.isRequired,
};

export default LastUpdate;
