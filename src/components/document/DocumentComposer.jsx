import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import styled from '@emotion/styled';

import useAutoSave from 'utils/hooks/useAutoSave';

import { DEFAULT_VALUE } from 'components/editor/utils';
import useCoreEditorProps from 'components/editor/useCoreEditorProps';
import useDocumentMutations from './useDocumentMutations';

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  letterSpacing: '-0.011em',
  marginBottom: '80px',
});

/*
 * SLATE UPGRADE TODO:
 * - Figure out how to show the inline discussion modal given a discussion ID
 * - Figure out how to pass resourceId to the image plugin
 * - Figure out how plugins are instantiated here
 */

const DocumentComposer = ({ afterUpdate, initialContent, ...props }) => {
  const contentEditor = useMemo(
    () => withHistory(withReact(createEditor())),
    []
  );
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_VALUE
  );
  const { handleUpdate } = useDocumentMutations(contentEditor);
  const coreEditorProps = useCoreEditorProps(contentEditor);

  async function handleUpdateWrapper() {
    await handleUpdate();
    afterUpdate();
  }

  useAutoSave(content, handleUpdateWrapper);

  return (
    <Slate editor={contentEditor} value={content} onChange={v => setContent(v)}>
      <DocumentEditable {...props} {...coreEditorProps} />
    </Slate>
  );
};

DocumentComposer.propTypes = {
  afterUpdate: PropTypes.func.isRequired,
  initialContent: PropTypes.string,
};

DocumentComposer.defaultProps = {
  initialContent: '',
};

export default DocumentComposer;
