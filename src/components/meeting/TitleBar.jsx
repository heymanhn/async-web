import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import styled from '@emotion/styled';

import updateMeetingMutation from 'graphql/mutations/updateMeeting';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

import RovalEditor from 'components/editor/RovalEditor';
import MeetingProperties from './MeetingProperties';
import StartDiscussionButton from './StartDiscussionButton';

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

const TitleEditor = styled(RovalEditor)({
  fontSize: '20px',
  fontWeight: 500,
  marginBottom: '5px',
});

const TitleBar = ({
  meeting: { author, id: meetingId, participants, title },
  ...props
}) => {
  const [updateMeeting] = useMutation(updateMeetingMutation);
  const { userId } = getLocalUser();
  const isAuthor = userId === author.id;

  async function handleUpdateTitle({ text }) {
    const { data } = await updateMeeting({
      variables: {
        meetingId,
        input: {
          title: text,
        },
      },
    });

    if (data.updateMeeting) {
      track('Meeting space title updated', { meetingId });
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to update meeting space'));
  }

  return (
    <Container {...props}>
      <InnerContainer>
        <Details>
          <TitleEditor
            contentType="meetingName"
            disableAutoFocus
            initialValue={title || 'Untitled Meeting Space'}
            isPlainText
            mode={isAuthor ? 'compose' : 'display'}
            onSubmit={handleUpdateTitle}
            saveOnBlur
          />
          <MeetingProperties
            author={author}
            initialParticipantIds={participants.map(p => p.user.id)}
            meetingId={meetingId}
          />
        </Details>
        <Actions>
          <StartDiscussionButton meetingId={meetingId} />
        </Actions>
      </InnerContainer>
    </Container>
  );
};

TitleBar.propTypes = {
  meeting: PropTypes.object.isRequired,
};

export default TitleBar;
