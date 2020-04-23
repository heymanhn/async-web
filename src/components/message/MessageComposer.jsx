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
import { DiscussionContext, MessageContext } from 'utils/contexts';

import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import DisplayedMessageToolbar from 'components/editor/toolbar/DisplayedMessageToolbar';
import MessageToolbar from 'components/editor/toolbar/MessageToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';
import MessageActions from './MessageActions';

const Container = styled.div(({ mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: mode === 'compose' ? '160px' : 'initial',
}));

const MessageEditable = styled(Editable)(({ ismodal }) => ({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '26px',
  marginTop: ismodal === 'true' ? '0px' : '15px',
}));

const MessageComposer = ({ initialMessage, autoFocus, ...props }) => {
  const { discussionId, isModal } = useContext(DiscussionContext);
  const { mode } = useContext(MessageContext);
  const editor = useMessageEditor(discussionId);
  const readOnly = mode === 'display';

  const {
    content: message,
    setContent: setMessage,
    ...contentProps
  } = useContentState({
    editor,
    resourceId: discussionId,
    initialContent: initialMessage,
  });

  const { handleCreate, handleUpdate, isSubmitting } = useMessageMutations({
    message,
  });

  const coreEditorProps = useCoreEditorProps(editor, { readOnly });
  useMessageDrafts(message, isSubmitting);
  useAnnotationMonitor(message, setMessage, editor, readOnly);

  return (
    <Container mode={mode} {...props}>
      <Slate editor={editor} key={readOnly} {...contentProps}>
        <MessageEditable
          autoFocus={autoFocus}
          ismodal={isModal.toString()}
          readOnly={readOnly}
          {...coreEditorProps}
        />
        {readOnly && <DisplayedMessageToolbar />}
        {!readOnly && <MessageToolbar />}
        <DefaultPlaceholder />
        <CompositionMenuButton />
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
  autoFocus: PropTypes.bool,
};

MessageComposer.defaultProps = {
  initialMessage: '',
  autoFocus: false,
};

export default MessageComposer;
