import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';
import { MessageContext } from 'utils/contexts';

import Editor from 'components/editor/Editor';

const SUBMIT_HOTKEY = 'cmd+enter';
// const ESCAPE_HOTKEY = 'Escape';

const Container = styled.div(
  ({ isThread }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: isThread ? 0 : '0 -60px',
    padding: isThread ? '10px 0 20px' : '10px 60px 20px',
  }),
  ({ mode, theme: { colors } }) => {
    if (mode !== 'compose') return {};

    // This keeps the action buttons visible at the bottom of the composer
    return {
      background: colors.white,
      position: 'sticky',
      bottom: 0,
    };
  }
);

const Section = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Button = styled.div(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 12, weight: 500 }),

  display: 'flex',
  alignItems: 'center',

  borderRadius: '5px',
  cursor: 'pointer',
  height: '25px',
  marginLeft: '8px',
  padding: '0 20px',
}));

const SubmitButton = styled(Button)(({ isDisabled, theme: { colors } }) => ({
  background: isDisabled ? colors.grey7 : colors.altBlue,
  color: isDisabled ? colors.grey4 : colors.white,
  cursor: isDisabled ? 'default' : 'pointer',
}));

const CancelButton = styled(Button)(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  color: colors.grey3,
}));

const SubmitLabel = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 12, weight: 500 }),
  color: colors.grey1,
}));

const DraftSavedLabel = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 12, weight: 600 }),
  display: 'flex',
  color: colors.grey4,
}));

const Timestamp = styled(Moment)({
  fontWeight: 400,
  marginLeft: '4px',
});

const MessageActions = ({ handleSubmit, ...props }) => {
  const { draft, isModalOpen, mode, parentType, handleCancel } = useContext(
    MessageContext
  );
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

  // TODO (DISCUSSION V2): Hook up the escape key to minimizing the composer
  // const handleEscapeKey = event => {
  //   event.preventDefault();

  //   // TODO (DISCUSSION V2): Minimize the composer
  // };

  // const handlers = [
  //   [SUBMIT_HOTKEY, handleSubmitWrapper],
  //   [ESCAPE_HOTKEY, handleEscapeKey],
  // ];

  useKeyDownHandler(
    [SUBMIT_HOTKEY, handleSubmitWrapper],

    // Make sure that cmd + enter doesn't work if a composer is open in both
    // the modal and a discussion page
    isModalOpen && parentType === 'discussion'
  );

  return (
    <Container isThread={parentType === 'thread'} mode={mode} {...props}>
      <Section>
        <SubmitLabel>⌘ + Enter to</SubmitLabel>
        <SubmitButton isDisabled={isEmptyContent} onClick={handleSubmitWrapper}>
          {mode === 'edit' ? 'Save Changes' : 'Post'}
        </SubmitButton>
        {mode === 'edit' && (
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
        )}
      </Section>
      {draft && mode === 'compose' && (
        <Section>
          <DraftSavedLabel>
            <span>Draft saved</span>
            <Timestamp fromNow parse="X">
              {draft.updatedAt}
            </Timestamp>
          </DraftSavedLabel>
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
