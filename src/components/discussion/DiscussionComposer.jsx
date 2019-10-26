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

  async function handleCreateDiscussion({ payload, text } = {}) {
    const input = { title };

    // It's possible to create a discussion without an initial message
    if (payload && text) {
      input.messages = [{
        body: {
          formatter: 'slatejs',
          text,
          payload,
        },
      }];
    }

    const { data: data2 } = await client.mutate({
      mutation: createConversationMutation,
      variables: { meetingId, input },
      refetchQueries: [{
        query: meetingQuery,
        variables: { id: meetingId, queryParams: {} },
      }],
    });

    if (data2.createConversation) {
      const { id: conversationId } = data2.createConversation;
      afterSubmit(conversationId);
      return Promise.resolve({ conversationId, isNewDiscussion: true });
    }

    return Promise.reject(new Error('Failed to create discussion'));
  }

  async function handleSubmitTitle({ text }) {
    if (title !== text) setTitle(text);
    return Promise.resolve({});
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
        onSubmit={handleSubmitTitle}
        saveOnBlur
      />
      <DiscussionMessage
        currentUser={currentUser}
        forceDisableSubmit={!title}
        initialMode="compose"
        meetingId={meetingId}
        onCancel={returnToMeetingSpace}
        onCreateDiscussion={handleCreateDiscussion}
      />
    </Container>
  );
};

DiscussionComposer.propTypes = {
  afterSubmit: PropTypes.func.isRequired,
  meetingId: PropTypes.string.isRequired,
};

export default DiscussionComposer;
