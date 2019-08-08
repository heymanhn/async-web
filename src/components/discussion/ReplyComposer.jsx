/*
 * Experimenting with React Hooks to create stateful function components:
 * https://reactjs.org/docs/hooks-overview.html
 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DiscussionReply from 'components/meeting/DiscussionReply';

// const ComposeContainer = styled.div(({ theme: { colors } }) => ({
//   display: 'flex',
//   flexDirection: 'row',
// }));

const Container = styled.div(({ roundedCorner }) => ({
  borderRadius: roundedCorner ? '0 0 5px 5px' : 'none',
}));

const Button = styled.div(({ theme: { colors } }) => ({
  alignSelf: 'center',
  color: colors.grey3,
  cursor: 'pointer',
  margin: '15px 30px 20px',
}));

const PlusSign = styled.span(({ theme: { colors } }) => ({
  fontSize: '20px',
  fontWeight: 400,
  paddingRight: '5px',
  position: 'relative',
  top: '1px',

  ':hover': {
    color: colors.grey2,
  },
}));

const ButtonText = styled.span(({ theme: { colors } }) => ({
  fontSize: '14px',
  fontWeight: 500,

  ':hover': {
    color: colors.grey2,
    textDecoration: 'underline',
  },
}));

const AddReplyButtonRow = ({
  afterSubmit,
  conversationId,
  focusedMessage,
  meetingId,
  ...props
}) => {
  const [isComposing, setIsComposing] = useState(false);

  function toggleComposeMode() {
    setIsComposing(!isComposing);
  }
  function disableComposeMode() {
    setIsComposing(false);
  }

  // TODO: Reset isComposing to false if conversation ID changed. using useEffect()
  // https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect
  useEffect(disableComposeMode, [conversationId]);

  const addReplyButton = (
    <Button onClick={toggleComposeMode}>
      <PlusSign>+</PlusSign>
      <ButtonText>ADD A REPLY</ButtonText>
    </Button>
  );

  const composer = (
    <DiscussionReply
      afterSubmit={afterSubmit}
      conversationId={focusedMessage ? focusedMessage.childConversationId : conversationId}
      focusedMessage={focusedMessage}
      initialMode="compose"
      meetingId={meetingId}
      onCancelCompose={toggleComposeMode}
    />
  );
  return (
    <Container {...props}>
      {isComposing ? composer : addReplyButton}
    </Container>
  );
};

AddReplyButtonRow.propTypes = {
  afterSubmit: PropTypes.func,
  conversationId: PropTypes.string.isRequired,
  focusedMessage: PropTypes.object,
  meetingId: PropTypes.string.isRequired,
  roundedCorner: PropTypes.bool,
};

AddReplyButtonRow.defaultProps = {
  afterSubmit: () => {},
  focusedMessage: null,
  roundedCorner: false,
};

export default AddReplyButtonRow;
