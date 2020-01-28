import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import updateDocumentMutation from 'graphql/mutations/updateDocument';
import useAutoSave from 'utils/hooks/useAutoSave';

import { DEFAULT_VALUE } from 'components/editor/utils';

const ContentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  letterSpacing: '-0.011em',
  marginBottom: '80px',
});

/*
 * TODO:
 * - port autoSave plugin into this new environment
 * - Figure out how to show the inline discussion modal given a discussion ID
 * - Figure out how to pass resourceId to the image plugin
 * - Figure out how plugins are instantiated here
 */

const ContentEditor = ({ afterUpdate, documentId, initialContent }) => {
  const contentEditor = useMemo(() => withReact(createEditor()), []);
  const [content, setContent] = useState(
    initialContent ? JSON.parse(initialContent) : DEFAULT_VALUE
  );
  const [updateDocument] = useMutation(updateDocumentMutation);

  // Pulls the content from the editor reference. The state variable will not
  // be up to date at the point that handleUpdate() is invoked, since it's
  // called via a setTimeout() call.
  async function handleUpdate() {
    const { children } = contentEditor;
    const { data: updateDocumentBodyData } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text: children.map(c => Node.string(c)).join('\n'),
            payload: JSON.stringify(children),
          },
        },
      },
    });

    if (updateDocumentBodyData.updateDocument) afterUpdate();
  }

  useAutoSave(content, handleUpdate);

  return (
    <Slate editor={contentEditor} value={content} onChange={v => setContent(v)}>
      <ContentEditable />
    </Slate>
  );
};

ContentEditor.propTypes = {
  afterUpdate: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  initialContent: PropTypes.string,
};

ContentEditor.defaultProps = {
  initialContent: '',
};

export default ContentEditor;
