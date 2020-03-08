import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import NotFound from 'components/navigation/NotFound';
import HeaderBar from 'components/navigation/HeaderBar';
import TopicComposer from './TopicComposer';
import DiscussionMessage from './DiscussionMessage';
import DiscussionThread from './DiscussionThread';
import AddReplyBox from './AddReplyBox';

const OuterContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
}));

const ContentContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 54px)', // Header bar is 54px tall
  margin: '0 auto',
  paddingBottom: '80px',
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
  })
);

const DiscussionContainer = ({ discussionId }) => {
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

  if ((draft || !messageCount) && !isComposing) startComposing();

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
      <OuterContainer>
        <HeaderBar />
        <ContentContainer ref={discussionRef}>
          <TopicComposer
            initialTopic={text}
            autoFocus={!text && !messageCount}
          />
          {!!messageCount && (
            <DiscussionThread
              isUnread={isUnread()}
              isComposingFirstMsg={!messageCount}
            />
          )}
          {isComposing ? (
            <StyledDiscussionMessage
              mode="compose"
              disableAutoFocus={!messageCount}
              afterCreate={stopComposing}
              handleCancel={handleCancelCompose}
            />
          ) : (
            <AddReplyBox
              handleClickReply={startComposing}
              isComposing={isComposing}
            />
          )}
        </ContentContainer>
      </OuterContainer>
    </DiscussionContext.Provider>
  );
};

DiscussionContainer.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionContainer;
