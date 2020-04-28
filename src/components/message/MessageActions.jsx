import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';
import { MessageContext } from 'utils/contexts';

import Editor from 'components/editor/Editor';

const SUBMIT_HOTKEY = 'cmd+enter';
const ESCAPE_HOTKEY = 'Escape';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  margin: '10px 0 20px',
});

const Section = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Button = styled.div({
  display: 'flex',
  alignItems: 'center',

  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 500,
  height: '25px',
  marginLeft: '8px',
  padding: '0 20px',
});

const SubmitButton = styled(Button)(({ theme: { colors } }) => ({
  background: colors.altBlue,
  color: colors.white,
}));

const CancelButton = styled(Button)(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  color: colors.grey3,
}));

const SubmitLabel = styled.div(({ theme: { colors } }) => ({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.grey1,
}));

const DraftSavedLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '12px',
}));

const MessageActions = ({ handleSubmit }) => {
  const { draft, mode, handleCancel } = useContext(MessageContext);
  const { handleDeleteMessageDraft } = useMessageDraftMutations();
  const editor = useSlate();
  const isEmptyContent = Editor.isEmptyContent(editor);

  const handleSubmitWrapper = event => {
    event.stopPropagation();
    return isEmptyContent ? null : handleSubmit();
  };

  const handleDiscardWrapper = async event => {
    event.stopPropagation();

    if (mode === 'compose' && draft) await handleDeleteMessageDraft();

    handleCancel();
  };

  const handleEscapeKey = event => {
    event.preventDefault();

    // TODO (DISCUSSION V2): Minimize the composer
  };

  const handlers = [
    [SUBMIT_HOTKEY, handleSubmitWrapper],
    [ESCAPE_HOTKEY, handleEscapeKey],
  ];
  useKeyDownHandler(handlers);
  useKeyDownHandler([SUBMIT_HOTKEY, handleSubmitWrapper]);

  return (
    <Container>
      <Section>
        <SubmitLabel>⌘ + Enter to</SubmitLabel>
        <SubmitButton onClick={handleSubmitWrapper}>
          {mode === 'edit' ? 'Save Changes' : 'Post'}
        </SubmitButton>
        {mode === 'edit' && (
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        )}
      </Section>
      {draft && (
        <Section>
          <DraftSavedLabel>Draft saved</DraftSavedLabel>
          <CancelButton onClick={handleDiscardWrapper}>Discard</CancelButton>
        </Section>
      )}
    </Container>
  );
};

MessageActions.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default MessageActions;
