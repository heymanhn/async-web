import React, { useRef, useState, useContext } from 'react';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import TopicComposer from './TopicComposer';
import DiscussionMessage from './DiscussionMessage';
import DiscussionThread from './DiscussionThread';
import ModalAddReplyBox from './ModalAddReplyBox';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  minWidth: discussionViewport,
}));

const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  })
);

const Discussion = () => {
  const { discussionId } = useContext(DiscussionContext);
  const discussionRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);

  const { loading, error, data } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
  });
  if (loading) return null;
  if (error || !data.discussion) return <NotFound />;

  const { topic, draft } = data.discussion;
  const { payload } = topic || {};
  const { items } = data.messages;

  if ((draft || !items) && !isComposing) startComposing();

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  }

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    draft,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <Container ref={discussionRef}>
        <TopicComposer initialTopic={payload} autoFocus={!payload || !items} />
        {items && <DiscussionThread isUnread={isUnread()} />}
        {isComposing ? (
          <StyledDiscussionMessage
            mode="compose"
            afterCreate={stopComposing}
            handleCancel={stopComposing}
          />
        ) : (
          <ModalAddReplyBox
            handleClickReply={startComposing}
            isComposing={isComposing}
          />
        )}
      </Container>
    </DiscussionContext.Provider>
  );
};

export default Discussion;
