import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import withHover from 'utils/withHover';

import ParticipantAvatars from 'components/shared/ParticipantAvatars';

const StyledLink = styled(Link)(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'column',

  cursor: 'pointer',
  borderTop: `1px solid ${colors.borderGrey}`,
  textDecoration: 'none',

  ':last-of-type': {
    borderBottom: `1px solid ${colors.borderGrey}`,
  },

  ':hover,:active,:visited': {
    textDecoration: 'none',
  },
}));

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  padding: '20px 20px 24px',
  width: '100%',
});

const MeetingDetails = styled.div({});

const Title = styled.span(({ hover, theme: { colors } }) => ({
  color: hover ? colors.blue : colors.mainText,
  fontSize: '16px',
  fontWeight: 500,
}));

const AdditionalInfo = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',

  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
  marginTop: '3px',
}));

const Separator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  margin: '0 10px',
}));

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
}));

const MeetingRow = ({ conversationCount, hover, meeting }) => {
  const { createdAt, deadline, id, lastMessage, participants, title } = meeting;

  const sortedParticipants = participants; // TO-DO
  const timestamp = lastMessage ? lastMessage.createdAt : createdAt;
  const timestampContext = lastMessage ? 'Latest reply ' : 'Created ';

  const metadata = [];
  if (conversationCount > 0) {
    metadata.push(<span>{Pluralize('discussion', conversationCount, true)}</span>);
  }
  if (timestamp) {
    metadata.push(
      <span>
        {timestampContext}
        <Timestamp fromNow parse="X">{timestamp}</Timestamp>
      </span>,
    );
  }
  if (deadline) {
    metadata.push(
      <span>
        {'Due in '}
        <Timestamp fromNow parse="X">{deadline}</Timestamp>
      </span>,
    );
  }

  const separator = <Separator>&#8226;</Separator>;

  return (
    <StyledLink to={`/meetings/${id}`}>
      <Container>
        <MeetingDetails>
          <Title hover={hover}>{title || 'Untitled Meeting'}</Title>
          <AdditionalInfo>
            {metadata.length > 0 && metadata[0]}
            {metadata.length > 1 && separator}
            {metadata.length > 1 && metadata[1]}
            {metadata.length > 2 && separator}
            {metadata.length > 2 && metadata[2]}
          </AdditionalInfo>
        </MeetingDetails>
        <ParticipantAvatars participants={sortedParticipants} />
      </Container>
    </StyledLink>
  );
};

MeetingRow.propTypes = {
  conversationCount: PropTypes.number.isRequired,
  hover: PropTypes.bool.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default withHover(MeetingRow);
