import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from 'react-apollo';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import createConversationMutation from 'graphql/mutations/createConversation';
import currentUserQuery from 'graphql/queries/currentUser';
import meetingQuery from 'graphql/queries/meeting';
import { getLocalUser } from 'utils/auth';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionMessage from './DiscussionMessage';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: discussionViewport,
  padding: '0 30px',
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '36px',
  fontWeight: 500,
  margin: '70px 0 30px 30px',
  width: '100%',
  outline: 'none',
}));

const DiscussionComposer = ({ afterSubmit, meetingId }) => {
  const client = useApolloClient();
  const [title, setTitle] = useState(null);
  const { userId } = getLocalUser();
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !data.user) return null;
  const currentUser = data.user;

  async function handleCreateDiscussion({ payload, text }) {
    const { data: data2 } = await client.mutate({
      mutation: createConversationMutation,
      variables: {
        meetingId,
        input: {
          title,
          messages: [{
            body: {
              formatter: 'slatejs',
              text,
              payload,
            },
          }],
        },
      },
      refetchQueries: [{
        query: meetingQuery,
        variables: { id: meetingId, queryParams: {} },
      }],
    });

    if (data2.createConversation) {
      afterSubmit(data2.createConversation.id);
      return Promise.resolve({ isNewDiscussion: true });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  function handleSubmitTitle({ text }) {
    // HACK due to https://github.com/ianstormtaylor/slate/issues/2434
    if (title !== text) setTimeout(() => setTitle(text), 0);
  }

  function returnToMeetingSpace() {
    navigate(`/spaces/${meetingId}`);
  }

  return (
    <Container>
      <TitleEditor
        contentType="discussionTitle"
        isPlainText
        mode="compose"
        onSubmitOnBlur={handleSubmitTitle}
        saveOnBlur
      />
      <DiscussionMessage
        currentUser={currentUser}
        forceDisableSubmit={!title}
        onCreateDiscussion={handleCreateDiscussion}
        initialMode="compose"
        onCancel={returnToMeetingSpace}
      />
    </Container>
  );
};

DiscussionComposer.propTypes = {
  afterSubmit: PropTypes.func.isRequired,
  meetingId: PropTypes.string.isRequired,
};

export default DiscussionComposer;
