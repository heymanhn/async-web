import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import useReactions from 'utils/hooks/useReactions';
import { matchCurrentUserId } from 'utils/auth';

import AddReactionButton from './AddReactionButton';
import ReactionCountDisplay from './ReactionCountDisplay';

const defaultHeight = '36px';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  color: colors.grey3,
  marginTop: '20px',
  minHeight: defaultHeight,
}));

const InnerContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  minHeight: defaultHeight,
}));

const ButtonContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  cursor: 'pointer',
  padding: '0px 15px',
});

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: defaultHeight,
  margin: 0,
}));

const StyledReactionCountDisplay = styled(ReactionCountDisplay)({});

const ButtonWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  ':first-of-type': {
    [StyledReactionCountDisplay]: {
      borderTopLeftRadius: '5px',
      borderBottomLeftRadius: '5px',
    },
  },
  ':last-of-type': {
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
});

const StyledAddReactionButton = styled(AddReactionButton)({
  marginLeft: '10px',
});

const MessageReactions = ({ conversationId, messageId, ...props }) => {
  const {
    addReaction,
    removeReaction,
    reactions,
    reactionsReference,
  } = useReactions({ conversationId, messageId });

  if (!reactions || !reactions.length) return null;

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

  const addReactionButton = (
    <StyledAddReactionButton
      conversationId={conversationId}
      messageId={messageId}
      placement="above"
    />
  );

  return (
    <Container {...props}>
      <InnerContainer>
        {reactionsToDisplay().map(r => (
          <ButtonWrapper key={r.code}>
            <StyledReactionCountDisplay
              code={r.code}
              currentUserReactionId={r.currentUserReactionId}
              icon={r.icon}
              onAddReaction={addReaction}
              onRemoveReaction={removeReaction}
              reactionCount={r.reactionCount}
            />
            <VerticalDivider />
          </ButtonWrapper>
        ))}
      </InnerContainer>
      {reactionsToDisplay().length > 0 ? addReactionButton : undefined}
    </Container>
  );
};

MessageReactions.propTypes = {
  conversationId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
};

export default MessageReactions;
