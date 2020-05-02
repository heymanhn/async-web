import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Slate, Editable } from 'slate-react';
import styled from '@emotion/styled';

import useAnnotationMonitor from 'hooks/message/useAnnotationMonitor';
import useContentState from 'hooks/editor/useContentState';
import useCoreEditorProps from 'hooks/editor/useCoreEditorProps';
import useMessageDrafts from 'hooks/message/useMessageDrafts';
import useMessageEditor from 'hooks/message/useMessageEditor';
import useMessageMutations from 'hooks/message/useMessageMutations';
import useQuoteReplies from 'hooks/message/useQuoteReplies';
import { MessageContext } from 'utils/contexts';

import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import MessageToolbar from 'components/editor/toolbar/MessageToolbar';
import ReadOnlyMessageToolbar from 'components/editor/toolbar/ReadOnlyMessageToolbar';
import MessageActions from './MessageActions';

const Container = styled.div(({ mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: mode === 'compose' ? '180px' : 'initial',
}));

const MessageEditable = styled(Editable)({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '26px',
});

const MessageEditor = ({ initialMessage, autoFocus, ...props }) => {
  const { mode, parentId } = useContext(MessageContext);
  const editor = useMessageEditor(parentId);
  const readOnly = mode === 'display';

  const {
    content: message,
    setContent: setMessage,
    ...contentProps
  } = useContentState({
    editor,
    resourceId: parentId,
    initialContent: initialMessage,
    readOnly,
  });

  const {
    handleCreateMessage,
    handleUpdateMessage,
    isSubmitting,
  } = useMessageMutations({
    message,
  });
  const handleSubmit =
    mode === 'compose' ? handleCreateMessage : handleUpdateMessage;

  const coreEditorProps = useCoreEditorProps(editor, { readOnly });
  useMessageDrafts(message, isSubmitting);
  useQuoteReplies(editor, setMessage);
  useAnnotationMonitor(message, setMessage, editor, readOnly);

  return (
    <Container mode={mode} {...props}>
      <Slate editor={editor} {...contentProps}>
        <MessageEditable
          autoFocus={autoFocus}
          readOnly={readOnly}
          {...coreEditorProps}
        />
        {readOnly && <ReadOnlyMessageToolbar />}
        {!readOnly && <MessageToolbar />}
        <DefaultPlaceholder />
        <CompositionMenuButton />
        {!readOnly && (
          <MessageActions
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Slate>
    </Container>
  );
};

MessageEditor.propTypes = {
  initialMessage: PropTypes.string,
  autoFocus: PropTypes.bool,
};

MessageEditor.defaultProps = {
  initialMessage: '',
  autoFocus: false,
};

export default MessageEditor;
