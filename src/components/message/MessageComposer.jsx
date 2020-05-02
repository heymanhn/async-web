import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import { useApolloClient } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import {
  DiscussionContext,
  MessageContext,
  ThreadContext,
} from 'utils/contexts';

import ActionsBar from 'components/shared/ActionsBar';
import TitleEditor from 'components/discussion/TitleEditor';

import Message from './Message';

const REPLY_HOTKEY = 'shift+r';

// Currently the composer will always be at the bottom of its parent container.
const Container = styled.div(({ theme: { colors } }) => ({
  position: 'sticky',
  bottom: 0,

  background: colors.white,
  borderTop: `3px solid ${colors.bgGrey}`,
  maxHeight: '60vh',
  overflow: 'auto',
  width: '100%',
  zIndex: 3,
}));

const Divider = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
}));

const MessageComposer = React.forwardRef(
  (
    {
      parentType,
      parentId,
      draft,
      title,
      messageCount,
      afterCreateMessage,
      ...props
    },
    composerRef
  ) => {
    const client = useApolloClient();
    const { bottomRef, hideComposer, quoteReply } = useContext(
      parentType === 'discussion' ? DiscussionContext : ThreadContext
    );
    const [isComposing, setIsComposing] = useState(draft || !messageCount);
    const startComposing = () => setIsComposing(true);
    const stopComposing = () => setIsComposing(false);
    const shouldDisplayTitle =
      parentType === 'discussion' && !messageCount && isComposing;

    useKeyDownHandler(
      [REPLY_HOTKEY, () => !isComposing && startComposing()],
      isComposing
    );

    const afterCreateWrapper = data => {
      stopComposing();
      afterCreateMessage(data);

      // Posting a message is behaviorally equivalent to marking the parent as read
      client.writeData({ data: { pendingMessages: [] } });

      const { current: bottomOfPage } = bottomRef;
      if (bottomOfPage) {
        // Make sure the new message is added before we scroll to bottom
        setTimeout(() => bottomOfPage.scrollIntoView(), 0);
      }
    };

    const handleCancelCompose = () => {
      stopComposing();
      if (!messageCount) navigate('/');
    };

    if (hideComposer) return null;
    if (!isComposing && quoteReply) startComposing();

    const messageValue = {
      draft,
      parentId,
    };

    return (
      <Container ref={composerRef} {...props}>
        <Divider />
        {shouldDisplayTitle && <TitleEditor initialTitle={title} />}
        {isComposing ? (
          <Message
            mode="compose"
            parentId={parentId}
            parentType={parentType}
            draft={draft}
            messageCount={messageCount}
            afterCreateMessage={afterCreateWrapper}
            handleCancel={handleCancelCompose}
          />
        ) : (
          <MessageContext.Provider value={messageValue}>
            <ActionsBar
              handleClickReply={startComposing}
              handleClickDiscard={stopComposing}
              parentType={parentType}
            />
          </MessageContext.Provider>
        )}
      </Container>
    );
  }
);

MessageComposer.propTypes = {
  parentType: PropTypes.oneOf(['discussion', 'thread']).isRequired,
  parentId: PropTypes.string.isRequired,
  draft: PropTypes.object,
  title: PropTypes.string,
  messageCount: PropTypes.number.isRequired,
  afterCreateMessage: PropTypes.func,
};

MessageComposer.defaultProps = {
  draft: null,
  title: '',
  afterCreateMessage: () => {},
};

export default MessageComposer;
