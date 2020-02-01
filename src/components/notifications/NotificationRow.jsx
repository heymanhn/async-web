import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import Moment from 'react-moment';
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

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
}));

const NotificationRow = ({ handleCloseDropdown, notification }) => {
  const { author, updatedAt, isUnread, title } = notification;
  const [context, subject] = title.split(': ');

  function constructURL() {
    const { payload } = notification;

    const payloadJSON = JSON.parse(payload);
    const payloadCamelJSON = {};
    Object.keys(payloadJSON).forEach(key => {
      payloadCamelJSON[camelCase(key)] = payloadJSON[key];
    });
    const { documentId, discussionId } = payloadCamelJSON;
    let path = '';
    if (documentId) path += `/d/${documentId}`;
    if (discussionId) path += `/discussions/${discussionId}`;

    return path;
  }

  function closeDropdownAndNavigate(event) {
    event.stopPropagation();
    handleCloseDropdown(() => navigate(constructURL()));
  }

  return (
    <Container isUnread={isUnread} onClick={closeDropdownAndNavigate}>
      <StyledAvatar
        avatarUrl={author.profilePictureUrl}
        title={author.fullName}
        alt={author.fullName}
        size={30}
      />
      <Details>
        <NotificationText>
          {`${context} `}
          <span>{subject}</span>
        </NotificationText>
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
