import React, { useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import {
  DEFAULT_SELECTION_CONTEXT,
  DiscussionContext,
  ThreadContext,
  SelectionContext,
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
}));

const Divider = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
}));

const MessageComposer = ({
  parentType,
  parentId,
  draft,
  title,
  messageCount,
  afterCreateMessage,
  ...props
}) => {
  const containerRef = useRef(null);
  const { hideComposer } = useContext(
    parentType === 'discussion' ? DiscussionContext : ThreadContext
  );
  const [isComposing, setIsComposing] = useState(false);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);
  const shouldDisplayTitle =
    parentType === 'discussion' && !messageCount && isComposing;

  useKeyDownHandler([REPLY_HOTKEY, () => !isComposing && startComposing()]);

  const afterCreateWrapper = data => {
    stopComposing();
    afterCreateMessage(data);
  };

  const handleCancelCompose = () => {
    stopComposing();
    if (!messageCount) navigate('/');
  };

  if ((draft || !messageCount) && !isComposing) startComposing();
  if (hideComposer) return null;

  const value = {
    ...DEFAULT_SELECTION_CONTEXT,
    containerRef: parentType === 'discussion' ? containerRef : {},
  };

  return (
    <Container ref={containerRef} {...props}>
      <Divider />
      {shouldDisplayTitle && <TitleEditor initialTitle={title} />}
      {isComposing ? (
        <SelectionContext.Provider value={value}>
          <Message
            mode="compose"
            parentId={parentId}
            parentType={parentType}
            draft={draft}
            disableAutoFocus={!messageCount}
            afterCreateMessage={afterCreateWrapper}
            handleCancel={handleCancelCompose}
          />
        </SelectionContext.Provider>
      ) : (
        <ActionsBar
          handleClickReply={startComposing}
          parentType={parentType}
          parentId={parentId}
        />
      )}
    </Container>
  );
};

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
