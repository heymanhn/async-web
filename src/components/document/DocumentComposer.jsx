import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Slate, Editable } from 'slate-react';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';
import useAutoSave from 'utils/hooks/useAutoSave';
import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import useDocumentOperationsPusher from 'utils/hooks/useDocumentOperationsPusher';

import useCoreEditorProps from 'components/editor/hooks/useCoreEditorProps';
import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';

import useDocumentEditor from './hooks/useDocumentEditor';

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '80px',
});

const DocumentComposer = ({ initialContent, ...props }) => {
  const { documentId, readOnly } = useContext(DocumentContext);
  const editor = useDocumentEditor(documentId);

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
