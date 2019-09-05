import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import MeetingProperties from './MeetingProperties';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '0px 30px',
  position: 'sticky',
  top: '0px',
  width: '100%',
}));

const InnerContainer = styled.div(({ theme: { meetingSpaceViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  margin: '0 auto',
  maxWidth: meetingSpaceViewport,
  padding: '20px 30px',
  zIndex: 1,
}));

const Details = styled.div({
});

const Actions = styled.div({
});

const Title = styled.div({
  fontSize: '20px',
  fontWeight: 500,
  marginBottom: '5px',
});

const TitleBar = ({
  meeting: { author, id: meetingId, participants, title },
  ...props
}) => (
  <Container {...props}>
    <InnerContainer>
      <Details>
        <Title>{title}</Title>
        <MeetingProperties
          author={author}
          initialParticipantIds={participants.map(p => p.user.id)}
          meetingId={meetingId}
        />
      </Details>
      <Actions>
        TBD
      </Actions>
    </InnerContainer>
  </Container>
);

TitleBar.propTypes = {
  meeting: PropTypes.object.isRequired,
};

export default TitleBar;
