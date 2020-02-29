import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';
import useDrafts from 'utils/hooks/useDrafts';

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

const MessageComposer = ({ initialMessage, autoFocus, isModal, ...props }) => {
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
  const { content: message, ...contentProps } = useContentState(initialMessage);

  const { handleCreate, handleUpdate, isSubmitting } = useMessageMutations({
    message,
  });

  const coreEditorProps = useCoreEditorProps(messageEditor, { readOnly });
  useDrafts(message, messageEditor, isSubmitting);

  return (
    <Container mode={mode} {...props}>
      <Slate editor={messageEditor} key={readOnly} {...contentProps}>
        <MessageEditable
          autoFocus={autoFocus}
          readOnly={readOnly}
          {...coreEditorProps}
        />
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
  autoFocus: PropTypes.bool,
  isModal: PropTypes.bool,
};

MessageComposer.defaultProps = {
  initialMessage: '',
  autoFocus: false,
  isModal: false,
};

export default MessageComposer;
