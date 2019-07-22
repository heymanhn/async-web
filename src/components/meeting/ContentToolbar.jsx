// HN: Future me, please find a way to DRY this up with <EditorActions />
import React from 'react';
import PropTypes from 'prop-types';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled/macro';

import withReactions from 'utils/withReactions';
import { matchCurrentUserId } from 'utils/auth';

import AddReactionButton from './AddReactionButton';
import ReactionCountDisplay from './ReactionCountDisplay';

const heights = {
  topic: '52px',
  modalTopic: '52px',
  modalReply: '32px',
};

const layouts = {
  topic: ({ colors }) => ({
    borderRadius: '0 0 5px 5px',
    borderTop: `1px solid ${colors.borderGrey}`,
    minHeight: heights.topic,
  }),
  modalTopic: ({ colors }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    minHeight: heights.modalTopic,
  }),
  modalReply: () => ({
    background: 'none',
    minHeight: heights.modalReply,
    marginTop: '10px',
  }),
};

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  color: colors.grey3,

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}), ({ contentType, theme: { colors } }) => layouts[contentType]({ colors }));

// Only for modal reply UIs
const InnerContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  minHeight: heights.modalReply,
}));

const ButtonContainer = styled.div(({ contentType }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: contentType === 'modalReply' ? 'center' : 'initial',

  cursor: 'pointer',
  padding: contentType === 'modalReply' ? '0px 15px' : '0px 25px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ contenttype, theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: contenttype === 'modalReply' ? '16px' : '22px',
  marginRight: '10px',
}));

const CountLabel = styled.div(({ contentType }) => ({
  fontSize: contentType === 'modalReply' ? '13px' : '14px',
  fontWeight: 500,
}));

const VerticalDivider = styled.div(({ contentType, theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: heights[contentType],
  margin: 0,
}));

const StyledReactionCountDisplay = styled(ReactionCountDisplay)({});

const ButtonWrapper = styled.div(({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}), ({ contentType }) => {
  if (contentType !== 'modalReply') return {};

  return {
    ':first-child': {
      [StyledReactionCountDisplay]: {
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px',
      },
    },
    ':last-child': {
      [VerticalDivider]: {
        display: 'none',
      },
      [ButtonContainer]: {
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
      },
      [StyledReactionCountDisplay]: {
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
      },
    },
  };
});

const StyledAddReactionButton = styled(AddReactionButton)({
  marginLeft: '15px',
});

const ContentToolbar = ({
  addReaction,
  contentType,
  conversationId,
  messageId,
  onClickReply,
  reactions,
  reactionsReference,
  removeReaction,
  replyCount,
  ...props
}) => {
  // TODO: Doing this for now. will make more complex later when reactions UX is added
  if (!replyCount && contentType === 'modalReply') return null;

  const reactionsToDisplay = () => {
    const histogram = [];

    reactionsReference.forEach((reax) => {
      const { code, icon } = reax;
      const matchingReactions = reactions.filter(r => r.code === reax.code);
      if (matchingReactions.length) {
        const reaxToDisplay = {
          code,
          icon,
          reactionCount: matchingReactions.length,
        };
        const currentUserReaction = matchingReactions.find(r => matchCurrentUserId(r.author.id));
        if (currentUserReaction) reaxToDisplay.currentUserReactionId = currentUserReaction.id;
        histogram.push(reaxToDisplay);
      }
    });

    return histogram;
  };

  const countLabel = replyCount || (contentType === 'topic' ? 'add a reply' : 0);
  const repliesButton = (
    <ButtonWrapper contentType={contentType}>
      <ButtonContainer contentType={contentType} onClick={onClickReply}>
        <StyledIcon contenttype={contentType} icon={faComment} />
        <CountLabel contentType={contentType}>{countLabel}</CountLabel>
      </ButtonContainer>
      <VerticalDivider contentType={contentType} />
    </ButtonWrapper>
  );
  const addReactionButton = (
    <StyledAddReactionButton
      conversationId={conversationId}
      messageId={messageId}
      size="large"
      source="toolbar"
    />
  );
  const innerContent = (
    <React.Fragment>
      {repliesButton}
      {reactionsToDisplay().map(r => (
        <ButtonWrapper key={r.code} contentType={contentType}>
          <StyledReactionCountDisplay
            code={r.code}
            contentType={contentType}
            currentUserReactionId={r.currentUserReactionId}
            icon={r.icon}
            onAddReaction={addReaction}
            onRemoveReaction={removeReaction}
            reactionCount={r.reactionCount}
          />
          <VerticalDivider contentType={contentType} />
        </ButtonWrapper>
      ))}
      {contentType !== 'modalReply' && addReactionButton}
    </React.Fragment>
  );

  if (contentType === 'modalReply') {
    return (
      <Container contentType={contentType} {...props}>
        <InnerContainer>
          {innerContent}
        </InnerContainer>
      </Container>
    );
  }

  return (
    <Container contentType={contentType} {...props}>
      {innerContent}
    </Container>
  );
};

ContentToolbar.propTypes = {
  addReaction: PropTypes.func.isRequired,
  contentType: PropTypes.oneOf(['topic', 'modalTopic', 'modalReply']).isRequired,
  conversationId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  onClickReply: PropTypes.func,
  reactions: PropTypes.array.isRequired,
  reactionsReference: PropTypes.array.isRequired,
  removeReaction: PropTypes.func.isRequired,
  replyCount: PropTypes.number.isRequired,
};

ContentToolbar.defaultProps = {
  onClickReply: () => {},
};

export default withReactions(ContentToolbar);
