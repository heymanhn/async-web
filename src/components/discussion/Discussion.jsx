import React, { useRef, useState, useContext } from 'react';
import { useQuery } from 'react-apollo';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import TopicComposer from './TopicComposer';
import DiscussionMessage from './DiscussionMessage';
import DiscussionThread from './DiscussionThread';
import AddReplyBox from './AddReplyBox';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  width: discussionViewport,
}));

const StyledLoadingIndicator = styled(LoadingIndicator)({
  marginTop: '30px',
});

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

  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  const { loading: loading2, data: data2 } = useQuery(discussionMessagesQuery, {
    variables: { discussionId, queryParams: {} },
  });
  if (loading || loading2) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data.discussion || !data2.messages) return <NotFound />;

  const { topic, draft, messageCount } = data.discussion;
  const { text } = topic || {};
  const { items } = data2.messages;

  if ((draft || !items) && !isComposing) startComposing();

  const isUnread = () => {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  };

  const returnToInbox = () => navigate('/inbox');

  const handleCancelCompose = () => {
    stopComposing();
    if (!messageCount) returnToInbox();
  };

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    draft,
    afterDelete: returnToInbox,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <Container ref={discussionRef}>
        <TopicComposer initialTopic={text} autoFocus={!text || !items} />
        {items && <DiscussionThread isUnread={isUnread()} />}
        {isComposing ? (
          <StyledDiscussionMessage
            mode="compose"
            afterCreate={stopComposing}
            handleCancel={handleCancelCompose}
          />
        ) : (
          <AddReplyBox
            handleClickReply={startComposing}
            isComposing={isComposing}
          />
        )}
      </Container>
    </DiscussionContext.Provider>
  );
};

export default Discussion;
