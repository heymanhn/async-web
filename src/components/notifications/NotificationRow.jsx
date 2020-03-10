import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import Moment from 'react-moment';
import Truncate from 'react-truncate';
import camelCase from 'camelcase';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ isUnread, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: isUnread ? colors.lightestBlue : colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  cursor: 'pointer',
  padding: '15px 15px 12px',

  ':last-of-type': {
    borderBottom: 'none',
  },

  ':hover': {
    background: isUnread ? colors.hoverBlue : colors.grey7,
  },
}));

const StyledAvatar = styled(Avatar)({
  flexShrink: 0,
  marginRight: '10px',
});

const Details = styled.div({
  marginTop: '-4px',
});

const NotificationText = styled.div({
  fontSize: '13px',
  fontWeight: 400,
  marginBottom: '-4px',
  span: {
    fontWeight: 600,
  },
});

const SnippetText = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '12px',
  fontWeight: 400,
  marginTop: '10px',
}));

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
}));

const NotificationRow = ({ handleCloseDropdown, notification }) => {
  const { author, updatedAt, readAt, payload, type } = notification;
  const payloadJSON = JSON.parse(payload);
  const payloadCamelJSON = {};
  Object.keys(payloadJSON).forEach(key => {
    payloadCamelJSON[camelCase(key)] = payloadJSON[key];
  });
  const { title, snippet } = payloadCamelJSON;
  const { documentId, discussionId } = payloadCamelJSON;

  const context = () => {
    let output;
    switch (type) {
      case 'new_message': {
        output = `${author.fullName} replied to`;
        break;
      }
      case 'edit_discussion': {
        output = `${author.fullName} resolved`;
        break;
      }
      default: {
        output = `${author.fullName} invited you to collaborate on`;
      }
    }

    return output;
  };

  const documentURL = () => {
    return type === 'new_message'
      ? `/documents/${documentId}/discussions/${discussionId}`
      : `/documents/${documentId}`;
  };

  const discussionURL = () => {
    return `/discussions/${discussionId}`;
  };

  const notificationURL = () => {
    return documentId ? documentURL() : discussionURL();
  };

  function closeDropdownAndNavigate(event) {
    event.stopPropagation();
    handleCloseDropdown(() => navigate(notificationURL()));
  }

  return (
    <Container isUnread={readAt < 0} onClick={closeDropdownAndNavigate}>
      <StyledAvatar
        avatarUrl={author.profilePictureUrl}
        title={author.fullName}
        alt={author.fullName}
        size={30}
      />
      <Details>
        <NotificationText>
          {`${context()} `}
          <span>{title}</span>
        </NotificationText>
        {snippet && (
          <SnippetText>
            <Truncate lines={2}>{snippet}</Truncate>
          </SnippetText>
        )}
        <Timestamp fromNow parse="X">
          {updatedAt}
        </Timestamp>
      </Details>
    </Container>
  );
};

NotificationRow.propTypes = {
  handleCloseDropdown: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};

export default NotificationRow;
