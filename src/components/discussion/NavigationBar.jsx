import React from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/react-hooks';
import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/queries/meeting';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '60px',
  padding: '0 30px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
});

const BackButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
  color: colors.grey4,

  ':hover': {
    color: colors.grey3,
  },
}));

const StyledChevron = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '16px',
  marginRight: '20px',
}));

const MeetingSpaceTitle = styled.div({
  fontSize: '16px',
});

const Separator = styled.div(({ theme: { colors } }) => ({
  color: colors.grey5,
  fontSize: '18px',
  margin: '0 10px',
}));

const DiscussionTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '16px',
  fontWeight: 500,
}));

const NavigationBar = ({ discussionTitle, meetingId, ...props }) => {
  let meetingTitle = '';
  const [getMeeting, { data }] = useLazyQuery(meetingQuery, { variables: { id: meetingId } });

  if (meetingId && !data) getMeeting();
  if (data && data.meeting) meetingTitle = data.meeting.title;

  return (
    <Container {...props}>
      {meetingTitle && meetingId && (
        <StyledLink to={`/spaces/${meetingId}`}>
          <BackButton>
            <StyledChevron icon={faChevronLeft} />
            <MeetingSpaceTitle>{meetingTitle}</MeetingSpaceTitle>
          </BackButton>
        </StyledLink>
      )}
      {meetingTitle && discussionTitle && <Separator>/</Separator>}
      {meetingTitle && discussionTitle && <DiscussionTitle>{discussionTitle}</DiscussionTitle>}
    </Container>
  );
};

NavigationBar.propTypes = {
  discussionTitle: PropTypes.string,
  meetingId: PropTypes.string,
};

NavigationBar.defaultProps = {
  discussionTitle: null,
  meetingId: null,
};

export default NavigationBar;
