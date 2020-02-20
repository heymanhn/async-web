import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

import { DiscussionContext, MessageContext } from 'utils/contexts';
import useKeyDownHandlers from 'utils/hooks/useKeyDownHandlers';

import Button from 'components/shared/Button';
import Editor from 'components/editor/Editor';
import useDraftMutations from './useDraftMutations';

const SUBMIT_HOTKEY = 'cmd+enter';

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
  padding: '4px 25px',
});

const MessageActions = ({ handleSubmit, isSubmitting }) => {
  const { draft } = useContext(DiscussionContext);
  const { mode, handleCancel } = useContext(MessageContext);
  const { handleDeleteDraft } = useDraftMutations();
  const editor = useSlate();
  const isSubmitDisabled = Editor.isEmptyContent(editor);

  const handleSubmitWrapper = event => {
    event.stopPropagation();
    return isSubmitDisabled ? null : handleSubmit();
  };

  const handleCancelWrapper = event => {
    event.stopPropagation();

    return mode === 'compose' && draft ? handleDeleteDraft() : handleCancel();
  };

  // HERMAN: WIP
  // useKeyDownHandlers([[SUBMIT_HOTKEY]]);
  // useEffect(() => {
  //   const handleKeyDown = event => {
  //     if (isHotkey(SUBMIT_HOTKEY, event)) {
  //       event.preventDefault();
  //       handleSubmitWrapper(event);
  //     }
  //   };

  //   if (isSubmitDisabled) return () => {};
  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // });

  return (
    <Container>
      <ButtonsContainer>
        <StyledButton
          isDisabled={isSubmitDisabled}
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
