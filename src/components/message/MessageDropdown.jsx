/* eslint no-alert: 0 */
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useClickOutside from 'hooks/shared/useClickOutside';
import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import useMessageMutations from 'hooks/message/useMessageMutations';
import { MessageContext, ThreadContext } from 'utils/contexts';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: `0px 0px 8px ${colors.borderGrey}`,
  position: 'absolute',
  right: '-1px',
  top: '-1px',
  zIndex: 100,
  width: 'max-content',
}));

const DropdownOption = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  padding: '12px 20px',

  ':hover': {
    background: colors.formGrey,
  },
  ':first-of-type': {
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  ':last-of-type': {
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
}));

const IconContainer = styled.div({
  minWidth: '20px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '14px',
}));

const OptionName = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),

  flexShrink: 0,
  color: colors.grey1,
  marginLeft: '10px',
  position: 'relative',
  top: '1px',
}));

const MessageDropdown = ({ handleCloseDropdown, isOpen, ...props }) => {
  const selector = useRef();
  const { parentId, listPosition, setMode } = useContext(MessageContext);
  const isFirstMessage = !listPosition;

  // If there's no thread ID, then there has to be a discussion ID
  const { threadId } = useContext(ThreadContext);
  const parentResourceType = threadId ? 'thread' : 'discussion';

  const { handleDeleteDiscussion } = useDiscussionMutations();
  const { handleDeleteMessage } = useMessageMutations();

  const handleClickOutside = () => {
    if (!isOpen) return;
    handleCloseDropdown();
  };
  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  // If the user is deleting the first message of a list of messages, ask if they
  // want to delete the whole discussion/thread.
  const handleDeleteWrapper = event => {
    event.stopPropagation();

    const resource = isFirstMessage ? parentResourceType : 'message';
    const userChoice = window.confirm(
      `Are you sure you want to delete this ${resource}?`
    );

    if (!userChoice) return null;

    handleCloseDropdown();
    return isFirstMessage
      ? handleDeleteDiscussion({ parentId })
      : handleDeleteMessage();
  };

  const handleEdit = event => {
    event.stopPropagation();
    handleCloseDropdown();
    setMode('edit');
  };

  return (
    <Container
      isFirstMessage={isFirstMessage}
      isOpen={isOpen}
      ref={selector}
      {...props}
    >
      <DropdownOption onClick={handleEdit}>
        <IconContainer>
          <StyledIcon icon="edit" />
        </IconContainer>
        <OptionName>Edit message</OptionName>
      </DropdownOption>
      <DropdownOption onClick={handleDeleteWrapper}>
        <IconContainer>
          <StyledIcon icon="times-circle" />
        </IconContainer>
        <OptionName>
          {isFirstMessage ? `Delete ${parentResourceType}` : 'Delete message'}
        </OptionName>
      </DropdownOption>
    </Container>
  );
};

MessageDropdown.propTypes = {
  handleCloseDropdown: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default MessageDropdown;
