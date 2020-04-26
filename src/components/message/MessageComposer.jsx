import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

// import AddReplyBox from 'components/discussion/AddReplyBox';
import DiscussionActions from 'components/discussion/DiscussionActions';
import TitleEditor from 'components/discussion/TitleEditor';

import Message from './Message';

// Currently the composer will always be at the bottom of its parent container.
const OuterContainer = styled.div({});

const LightShadow = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  height: '3px',
}));

const Container = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  width: '100%',
}));

// TODO (DISCUSSION V2): Distinguish between composer for discussion
// and composer for thread
const MessageComposer = ({ source, parentId, draft, title, messageCount }) => {
  const [isComposing, setIsComposing] = useState(false);
  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);
  const shouldDisplayTitle =
    source === 'discussion' && !messageCount && isComposing;

  const handleCancelCompose = () => {
    stopComposing();
    if (!messageCount) navigate('/');
  };

  if ((draft || !messageCount) && !isComposing) startComposing();

  return (
    <OuterContainer>
      <LightShadow />
      <Container>
        {shouldDisplayTitle && <TitleEditor initialTitle={title} />}
        {isComposing ? (
          <Message
            mode="compose"
            parentId={parentId}
            draft={draft}
            disableAutoFocus={!messageCount}
            afterCreateMessage={stopComposing}
            handleCancel={handleCancelCompose}
          />
        ) : (
          <DiscussionActions />
        )}
      </Container>
    </OuterContainer>
  );
};

/* <AddReplyBox
    handleClickReply={startComposing}
    isComposing={isComposing}
   />
*/

MessageComposer.propTypes = {
  source: PropTypes.string.isRequired,
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
