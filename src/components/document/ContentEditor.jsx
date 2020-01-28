import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import updateDocumentMutation from 'graphql/mutations/updateDocument';

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

  async function handleUpdate() {
    const { data: updateDocumentBodyData } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text: content.map(c => Node.string(c)).join('\n'),
            payload: JSON.stringify(content),
          },
        },
      },
    });

    if (updateDocumentBodyData.updateDocument) afterUpdate();
  }

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
