import React, { Component } from 'react';
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

class NotificationRow extends Component {
  constructor(props) {
    super(props);

    this.closeDropdownAndNavigate = this.closeDropdownAndNavigate.bind(this);
    this.constructURL = this.constructURL.bind(this);
  }

  closeDropdownAndNavigate(event) {
    event.stopPropagation();
    const { handleCloseDropdown } = this.props;
    handleCloseDropdown(() => navigate(this.constructURL()));
  }

  constructURL() {
    const { notification: { payload } } = this.props;

    const payloadJSON = JSON.parse(payload);
    const payloadCamelJSON = {};
    Object.keys(payloadJSON).forEach((key) => {
      payloadCamelJSON[camelCase(key)] = payloadJSON[key];
    });
    const { meetingId, conversationId } = payloadCamelJSON;
    let path = '';
    if (meetingId) path += `/meetings/${meetingId}`;
    if (conversationId) path += `/conversations/${conversationId}`;

    return path;
  }

  render() {
    const { notification } = this.props;
    const { author, createdAt, isUnread, title } = notification;

    // HN: Doing this on the frontend for now. This should be passed to the client as two
    // separate strings in the future
    const [context, subject] = title.split(': ');

    return (
      <Container isUnread={isUnread} onClick={this.closeDropdownAndNavigate}>
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
  }
}

NotificationRow.propTypes = {
  handleCloseDropdown: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};

export default NotificationRow;
