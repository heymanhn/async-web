/* eslint no-alert: 0 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

import { DiscussionContext, MessageContext } from 'utils/contexts';
import useDraftMutations from 'utils/hooks/useDraftMutations';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';

import Button from 'components/shared/Button';
import Editor from 'components/editor/Editor';

const SUBMIT_HOTKEY = 'cmd+enter';
const ESCAPE_HOTKEY = 'Escape';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',

  marginTop: '25px',
});

const ButtonsContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledButton = styled(Button)({
  height: '32px',
  marginLeft: '10px',
  padding: '4px 25px 5px',
});

const MessageActions = ({ handleSubmit, isSubmitting }) => {
  const { draft } = useContext(DiscussionContext);
  const { mode, handleCancel } = useContext(MessageContext);
  const { handleDeleteDraft } = useDraftMutations();
  const editor = useSlate();
  const isEmptyContent = Editor.isEmptyContent(editor);

  const handleSubmitWrapper = event => {
    event.stopPropagation();
    return isEmptyContent ? null : handleSubmit();
  };

  const handleCancelWrapper = async event => {
    event.stopPropagation();

    if (mode === 'compose' && draft) await handleDeleteDraft();

    handleCancel();
  };

  const handleEscapeKey = event => {
    event.preventDefault();

    if (!isEmptyContent) {
      const actionText = draft
        ? 'discard this draft'
        : 'stop composing this message';
      const userChoice = window.confirm(
        `Are you sure you want to ${actionText}?`
      );

      if (!userChoice) return null;
    }

    return handleCancelWrapper(event);
  };

  const handlers = [
    [SUBMIT_HOTKEY, handleSubmitWrapper],
    [ESCAPE_HOTKEY, handleEscapeKey],
  ];
  useKeyDownHandler(handlers);

  return (
    <Container>
      <ButtonsContainer>
        <StyledButton
          isDisabled={isEmptyContent}
          loading={isSubmitting}
          onClick={handleSubmitWrapper}
          title={mode === 'compose' ? 'Post' : 'Save'}
          type="light"
        />
        <StyledButton
          onClick={handleCancelWrapper}
          title={mode === 'compose' && draft ? 'Discard Draft' : 'Cancel'}
          type="grey"
        />
      </ButtonsContainer>
    </Container>
  );
};

MessageActions.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default MessageActions;
