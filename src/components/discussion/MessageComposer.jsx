import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';
import useDrafts from 'utils/hooks/useDrafts';

import { DEFAULT_VALUE } from 'components/editor/utils';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import withMarkdownShortcuts from 'components/editor/withMarkdownShortcuts';
import Toolbar from 'components/editor/toolbar/Toolbar';
import withVoidElements from 'components/editor/withVoidElements';
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
 * - Pass the right "isModal" into the message context to indicate when modal vs normal
 * - Get the keyboard shortcuts working for saving the message (cmd + enter)
 */

const MessageComposer = ({ initialMessage, ...props }) => {
  const { mode } = useContext(MessageContext);
  const messageEditor = useMemo(
    () =>
      withMarkdownShortcuts(
        withVoidElements(withHistory(withReact(createEditor())))
      ),
    []
  );
  const [message, setMessage] = useState(
    initialMessage ? JSON.parse(initialMessage) : DEFAULT_VALUE
  );

  const { handleCreate, handleUpdate, isSubmitting } = useMessageMutations({
    message,
  });

  const coreEditorProps = useCoreEditorProps(messageEditor);
  useDrafts(message, messageEditor, isSubmitting);
  const isEmptyMessage = message === JSON.stringify(DEFAULT_VALUE);

  return (
    <Container mode={mode} {...props}>
      <Slate
        editor={messageEditor}
        value={message}
        onChange={v => setMessage(v)}
        key={mode === 'display'}
      >
        <MessageEditable readOnly={mode === 'display'} {...coreEditorProps} />
        <Toolbar source="message" />
        {mode !== 'display' && (
          <MessageActions
            handleSubmit={mode === 'compose' ? handleCreate : handleUpdate}
            isSubmitDisabled={isEmptyMessage}
            isSubmitting={isSubmitting}
          />
        )}
      </Slate>
    </Container>
  );
};

MessageComposer.propTypes = {
  initialMessage: PropTypes.string,
};

MessageComposer.defaultProps = {
  initialMessage: '',
};

export default MessageComposer;
