import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Slate, Editable } from 'slate-react';
import styled from '@emotion/styled';

import useAutoSave from 'hooks/editor/useAutoSave';
import useContentState from 'hooks/editor/useContentState';
import useCoreEditorProps from 'hooks/editor/useCoreEditorProps';
import useDocumentMutations from 'hooks/document/useDocumentMutations';
import useDocumentOperationsPusher from 'hooks/document/useDocumentOperationsPusher';
import { DocumentContext } from 'utils/contexts';

import DefaultPlaceholder from 'components/editor/DefaultPlaceholder';
import DocumentToolbar from 'components/editor/toolbar/DocumentToolbar';
import CompositionMenuButton from 'components/editor/compositionMenu/CompositionMenuButton';

const DocumentEditable = styled(Editable)(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  lineHeight: '26px',
  marginBottom: '80px',
}));

const DocumentEditor = ({ initialContent, ...props }) => {
  const { documentId, editor, readOnly } = useContext(DocumentContext);

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

  const { handleUpdateDocument } = useDocumentMutations();
  const coreEditorProps = useCoreEditorProps(editor);
  const handleNewOperations = useDocumentOperationsPusher(
    editor,
    setLastTouchedToNow
  );

  useAutoSave({ content, handleSave: handleUpdateDocument });

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

DocumentEditor.propTypes = {
  initialContent: PropTypes.string,
};

DocumentEditor.defaultProps = {
  initialContent: '',
};

export default DocumentEditor;
