import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import { DEFAULT_SELECTION_CONTEXT, SelectionContext } from 'utils/contexts';

// TODO (DISCUSSION V2): Coming soon, will replace AddReplyBox
// import DiscussionActions from 'components/discussion/DiscussionActions';
import ActionsBar from 'components/shared/ActionsBar';
import TitleEditor from 'components/discussion/TitleEditor';

import Message from './Message';

// Currently the composer will always be at the bottom of its parent container.
const Container = styled.div(({ theme: { colors } }) => ({
  position: 'sticky',
  bottom: 0,

  borderTop: `1px solid ${colors.borderGrey}`,
  boxShadow: `0 0 0 3px ${colors.bgGrey}`,
  maxHeight: '60vh',
  overflow: 'auto',
  width: '100%',
}));

// TODO (DISCUSSION V2): Distinguish between composer for discussion
// and composer for thread
const MessageComposer = ({
  parentType,
  parentId,
  draft,
  title,
  messageCount,
}) => {
  const containerRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);
  const shouldDisplayTitle =
    parentType === 'discussion' && !messageCount && isComposing;

  const handleCancelCompose = () => {
    stopComposing();
    if (!messageCount) navigate('/');
  };

  if ((draft || !messageCount) && !isComposing) startComposing();

  const value = {
    ...DEFAULT_SELECTION_CONTEXT,
    containerRef,
  };

  return (
    <Container ref={containerRef}>
      {shouldDisplayTitle && <TitleEditor initialTitle={title} />}
      {isComposing ? (
        <SelectionContext.Provider value={value}>
          <Message
            mode="compose"
            parentId={parentId}
            draft={draft}
            disableAutoFocus={!messageCount}
            afterCreateMessage={stopComposing}
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
};

MessageComposer.defaultProps = {
  draft: null,
  title: '',
};

export default MessageComposer;
