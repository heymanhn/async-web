import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';
import useDrafts from 'utils/hooks/useDrafts';

import { DEFAULT_ELEMENT } from 'components/editor/utils';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import MessageToolbar from 'components/editor/toolbar/MessageToolbar';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import withLinks from 'components/editor/withLinks';
import withVoidElements from 'components/editor/withVoidElements';
import withPasteShim from 'components/editor/withPasteShim';
import withCustomKeyboardActions from 'components/editor/withCustomKeyboardActions';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import useMessageMutations from './useMessageMutations';
import MessageActions from './MessageActions';

const Container = styled.div(({ mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: mode === 'compose' ? '160px' : 'initial',
}));

const MessageEditable = styled(Editable)({
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
  lineHeight: '26px',
  marginTop: '15px',
});

/*
 * SLATE UPGRADE TODO:
 * - Get the keyboard shortcuts working for saving the message (cmd + enter)
 */

const MessageComposer = ({ initialMessage, isModal, ...props }) => {
  const { mode } = useContext(MessageContext);
  const readOnly = mode === 'display';
  const messageEditor = useMemo(
    () =>
      compose(
        withCustomKeyboardActions,
        withMarkdownShortcuts,
        withLinks,
        withVoidElements,
        withPasteShim,
        withHistory,
        withReact
      )(createEditor()),
    []
  );
  const [message, setMessage] = useState(
    initialMessage ? JSON.parse(initialMessage) : DEFAULT_ELEMENT
  );

  const { handleCreate, handleUpdate, isSubmitting } = useMessageMutations({
    message,
  });

  const coreEditorProps = useCoreEditorProps(messageEditor, { readOnly });
  useDrafts(message, messageEditor, isSubmitting);

  return (
    <Container mode={mode} {...props}>
      <Slate
        editor={messageEditor}
        value={message}
        onChange={v => setMessage(v)}
        key={readOnly}
      >
        <MessageEditable readOnly={readOnly} {...coreEditorProps} />
        <MessageToolbar />
        <CompositionMenuButton isModal={isModal} />
        {!readOnly && (
          <MessageActions
            handleSubmit={mode === 'compose' ? handleCreate : handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}
      </Slate>
    </Container>
  );
};

MessageComposer.propTypes = {
  initialMessage: PropTypes.string,
  isModal: PropTypes.bool,
};

MessageComposer.defaultProps = {
  initialMessage: '',
  isModal: false,
};

export default MessageComposer;
