import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import discussionMessagesQuery from 'graphql/queries/discussionMessages';
import { DiscussionContext, DEFAULT_DISCUSSION_CONTEXT } from 'utils/contexts';
import useUpdateSelectedResource from 'utils/hooks/useUpdateSelectedResource';

import LoadingIndicator from 'components/shared/LoadingIndicator';
import NavigationBar from 'components/navigation/NavigationBar';
import NotFound from 'components/navigation/NotFound';
import TopicComposer from './TopicComposer';
import DiscussionMessage from './DiscussionMessage';
import DiscussionThread from './DiscussionThread';
import AddReplyBox from './AddReplyBox';
import DiscussionModal from './DiscussionModal';

const OuterContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const ContentContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  // Vertically center the page when content doesn't fit full height
  minHeight: 'calc(100vh - 60px)', // Navigation bar is 60px tall
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
  useUpdateSelectedResource(discussionId);
  const discussionRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  // TODO (DISCUSSION V2): DRY this up / clean up the identical state in
  // DocumentContainer.
  const [state, setState] = useState({
    modalDiscussionId: null,
    firstMsgDiscussionId: null,
    deletedDiscussionId: null,
    isModalOpen: false,
    inlineDiscussionTopic: null,
  });
  const setFirstMsgDiscussionId = id =>
    setState(old => ({ ...old, firstMsgDiscussionId: id }));
  const setDeletedDiscussionId = id =>
    setState(old => ({ ...old, deletedDiscussionId: id }));
  const resetInlineTopic = () =>
    setState(old => ({ ...old, inlineDiscussionTopic: null }));

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
  const { tags } = data.discussion;

  if ((draft || !messageCount) && !isComposing) startComposing();

  const readOnly = (tags || []).includes('viewer');
  const isUnread = () => {
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

  // TODO (DISCUSSION V2): DRY this up with DocumentContainer implementation
  const handleShowModal = (dId, content) => {
    const newState = {
      modalDiscussionId: dId,
      isModalOpen: true,
    };

    // For creating inline discussion context later on
    if (content) newState.inlineDiscussionTopic = content;

    setState(oldState => ({ ...oldState, ...newState }));
  };

  // TODO (DISCUSSION V2): DRY this up with DocumentContainer implementation
  const handleCloseModal = () => {
    setState(oldState => ({
      ...oldState,
      modalDiscussionId: null,
      isModalOpen: false,
    }));
  };

  const {
    modalDiscussionId,
    firstMsgDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,
    isModalOpen,
  } = state;

  if (forceUpdate) setForceUpdate(false);

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    draft,
    readOnly,
    isModalOpen,
    modalDiscussionId,
    firstMsgDiscussionId,
    deletedDiscussionId,
    inlineDiscussionTopic,
    afterDelete: returnToInbox,
    setForceUpdate,
    setFirstMsgDiscussionId,
    setDeletedDiscussionId,
    resetInlineTopic,
    handleShowModal,
    handleCloseModal,
  };

  return (
    <DiscussionContext.Provider value={value}>
      <OuterContainer>
        <NavigationBar />
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
        {isModalOpen && (
          <DiscussionModal
            isOpen={isModalOpen}
            mode="discussion"
            handleClose={handleCloseModal}
          />
        )}
      </OuterContainer>
    </DiscussionContext.Provider>
  );
};

DiscussionContainer.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionContainer;
