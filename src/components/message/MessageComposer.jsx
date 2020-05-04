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
const Container = styled.div(({ isComposing, theme: { colors } }) => ({
  position: isComposing ? 'unset' : 'sticky',
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
  ({ title, afterCreateMessage, ...props }, composerRef) => {
    const client = useApolloClient();
    const messageContext = useContext(MessageContext);
    const { draft, parentType } = messageContext;
    const { bottomRef, hideComposer, messageCount, quoteReply } = useContext(
      parentType === 'discussion' ? DiscussionContext : ThreadContext
    );

    const scrollToBottom = () => {
      const { current: bottomOfPage } = bottomRef;
      if (bottomOfPage) {
        // Make sure the new message is added before we scroll to bottom
        setTimeout(() => bottomOfPage.scrollIntoView(), 0);
      }
    };

    const [isComposing, setIsComposing] = useState(draft || !messageCount);
    const startComposing = () => {
      scrollToBottom();
      setIsComposing(true);
    };
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
      scrollToBottom();
    };

    const handleCancelCompose = () => {
      stopComposing();
      if (!messageCount) navigate('/');
    };

    if (hideComposer) return null;
    if (!isComposing && quoteReply) startComposing();

    return (
      <Container ref={composerRef} isComposing={isComposing} {...props}>
        <Divider />
        {shouldDisplayTitle && <TitleEditor initialTitle={title} />}
        {isComposing ? (
          <Message
            mode="compose"
            afterCreateMessage={afterCreateWrapper}
            handleCancel={handleCancelCompose}
          />
        ) : (
          <ActionsBar
            handleClickReply={startComposing}
            handleClickDiscard={stopComposing}
            parentType={parentType}
          />
        )}
      </Container>
    );
  }
);

MessageComposer.propTypes = {
  title: PropTypes.string,
  afterCreateMessage: PropTypes.func,
};

MessageComposer.defaultProps = {
  title: '',
  afterCreateMessage: () => {},
};

export default MessageComposer;
