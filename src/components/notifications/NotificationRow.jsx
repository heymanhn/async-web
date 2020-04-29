import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import moment from 'moment';
import Truncate from 'react-truncate';
import camelCase from 'camelcase';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import Avatar from 'components/shared/Avatar';
import UnreadIndicator from 'components/shared/UnreadIndicator';

const Container = styled.div(({ isUnread, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: isUnread ? colors.white : colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  cursor: 'pointer',
  padding: '15px 20px',

  ':last-of-type': {
    borderBottom: 'none',
  },

  ':hover': {
    background: colors.white,
  },
}));

const StyledAvatar = styled(Avatar)({
  flexShrink: 0,
  marginRight: '10px',
});

const Details = styled.div({
  width: '100%',
});

const TitleContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey0,
  fontSize: '13px',
  fontWeight: 400,
}));

const Bold = styled.span({
  fontWeight: 600,
});

const TimestampContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  marginLeft: '10px',
});

const StyledIndicator = styled(UnreadIndicator)({
  marginRight: '5px',
});

const Timestamp = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '13px',
}));

const SnippetText = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '13px',
  fontWeight: 400,
  marginTop: '15px',
}));

const NotificationRow = ({ handleClose, notification }) => {
  const { author, updatedAt, readAt, payload, type } = notification;
  const { id, fullName, profilePictureUrl } = author;
  const { userId } = getLocalUser();
  const isAuthor = userId === id;

  const isUnread = readAt < 0;

  const payloadJSON = JSON.parse(payload);
  const payloadCamelJSON = {};
  Object.keys(payloadJSON).forEach(key => {
    payloadCamelJSON[camelCase(key)] = payloadJSON[key];
  });
  const { title, snippet } = payloadCamelJSON;
  const { documentId, discussionId, workspaceId, threadId } = payloadCamelJSON;

  const documentURL = `/documents/${documentId}`;
  const discussionThreadURL = `/discussions/${discussionId}/threads/${threadId}`;
  const documentThreadURL = `/documents/${documentId}/threads/${threadId}`;
  const discussionURL = `/discussions/${discussionId}`;
  const workspaceURL = `/workspaces/${workspaceId}`;
  const threadURL = documentId ? documentThreadURL : discussionThreadURL;

  const metaInfo = () => {
    let url;
    let context;
    switch (type) {
      case 'new_workspace':
      case 'access_workspace':
        url = workspaceURL;
        context = ' invited you to workspace: ';
        break;
      case 'new_workspace_resource':
        url = documentId ? documentURL : discussionURL;
        context = ' added workspace resource: ';
        break;
      case 'new_document':
      case 'access_document':
        url = documentURL;
        context = ' invited you to collaborate on document: ';
        break;
      case 'edit_document':
        url = documentURL;
        context = ' made edits to: ';
        break;
      case 'new_discussion':
      case 'access_discussion':
        url = threadId ? discussionThreadURL : discussionURL;
        context = ' invited you to join the discussion: ';
        break;
      case 'resolve_discussion':
        url = threadId ? discussionThreadURL : discussionURL;
        context = ' resolved the discussion: ';
        break;
      case 'new_message':
        url = threadId ? threadURL : discussionURL;
        context = threadId
          ? ' replied to thread: '
          : ' replied to discussion: ';
        break;
      default:
        url = '/inbox';
    }

    return { url, context };
  };

  const { url: notificationUrl, context: notificationContext } = metaInfo();

  const handleClick = event => {
    event.stopPropagation();
    navigate(notificationUrl);
    handleClose();
  };

  return (
    <Container isUnread={isUnread} onClick={handleClick}>
      <StyledAvatar
        avatarUrl={profilePictureUrl}
        title={fullName}
        alt={fullName}
        size={24}
      />
      <Details>
        <TitleContainer>
          <Title>
            <Bold>{isAuthor ? 'You' : fullName}</Bold>
            <span>{notificationContext}</span>
            <Bold>{title}</Bold>
          </Title>
          <TimestampContainer>
            {isUnread && <StyledIndicator diameter={6} />}
            <Timestamp>{moment(updatedAt, 'X').fromNow()}</Timestamp>
          </TimestampContainer>
        </TitleContainer>
        {snippet && (
          <SnippetText>
            <Truncate lines={2}>{snippet}</Truncate>
          </SnippetText>
        )}
      </Details>
    </Container>
  );
};

NotificationRow.propTypes = {
  handleClose: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};

export default NotificationRow;
