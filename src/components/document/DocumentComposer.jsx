import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Slate, Editable } from 'slate-react';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';
import useAutoSave from 'utils/hooks/useAutoSave';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import useDocumentOperationsPusher from 'utils/hooks/useDocumentOperationsPusher';

import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import Editor from 'components/editor/Editor';
import useCoreEditorProps from 'components/editor/hooks/useCoreEditorProps';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '80px',
});

const DocumentComposer = ({ initialContent, ...props }) => {
  const {
    documentId,
    editor,
    deletedDiscussionId,
    firstMsgDiscussionId,
    readOnly,
    setDeletedDiscussionId,
    setFirstMsgDiscussionId,
  } = useContext(DocumentContext);

  const {
    content,
    onChange,
    setLastTouchedToNow,
    ...contentProps
  } = useContentState({
    editor,
    resourceId: documentId,
    initialContent,
  });

  const { handleUpdate } = useDocumentMutations();
  const coreEditorProps = useCoreEditorProps(editor);
  const handleNewOperations = useDocumentOperationsPusher(
    editor,
    setLastTouchedToNow
  );

  useAutoSave({ content, handleSave: handleUpdate });

  const onChangeWrapper = value => {
    onChange(value);
    handleNewOperations();
  };

  // TODO (DISCUSSION V2): This is copy-pasta'ed into MessageComposer for
  // dealing with updating inline discussions. Can this be DRY'ed up?
  if (firstMsgDiscussionId) {
    Editor.updateInlineAnnotation(editor, firstMsgDiscussionId, {
      isInitialDraft: false,
    });
    setFirstMsgDiscussionId(null);
  }

  // TODO (DISCUSSION V2): This is copy-pasta'ed into MessageComposer for
  // dealing with updating inline discussions. Can this be DRY'ed up?
  if (deletedDiscussionId) {
    Editor.removeInlineAnnotation(editor, deletedDiscussionId);
    setDeletedDiscussionId(null);
  }

  return (
    <Slate editor={editor} onChange={onChangeWrapper} {...contentProps}>
      <DocumentEditable readOnly={readOnly} {...props} {...coreEditorProps} />
      <DocumentToolbar />
      <DefaultPlaceholder />
      <CompositionMenuButton />
    </Slate>
  );
};

DocumentComposer.propTypes = {
  initialContent: PropTypes.string,
};

DocumentComposer.defaultProps = {
  initialContent: '',
};

export default DocumentComposer;
