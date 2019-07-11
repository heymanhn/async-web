import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ isUnread, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: isUnread ? colors.lightestBlue : colors.bgGrey,
  borderTop: `1px solid ${colors.borderGrey}`,
  padding: '15px 15px 12px',
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
  cursor: 'default',
  fontSize: '12px',
}));

const NotificationRow = ({ notification }) => {
  const { author, createdAt, isUnread, payload, title } = notification;

  // HN: Doing this on the frontend for now. This should be passed to the client as two
  // separate strings in the future
  const [context, subject] = title.split(': ');

  return (
    <Container isUnread={isUnread}>
      <StyledAvatar src={author.profilePictureUrl} size={30} />
      <Details>
        <NotificationText>
          {`${context} `}
          <span>{subject}</span>
        </NotificationText>
        <Timestamp fromNow parse="X">{createdAt}</Timestamp>
      </Details>
    </Container>
  );
};

NotificationRow.propTypes = {
  notification: PropTypes.object.isRequired,
};

export default NotificationRow;
