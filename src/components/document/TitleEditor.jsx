import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { createEditor, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import { track } from 'utils/analytics';

import { DEFAULT_VALUE, deserializedTitle } from 'components/editor/utils';

const TitleEditable = styled(Editable)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  lineHeight: '54px',
  marginTop: '60px',
  marginBottom: '15px',
  width: '100%',
  outline: 'none',
}));

/*
 * TODO:
 * - any pasted text is converted to one line of plain text before it's saved
 *   to the title
 * - Pressing Enter changes focus to the beginning of the content
 */

const TitleEditor = ({ afterUpdate, documentId, initialTitle, ...props }) => {
  const titleEditor = useMemo(() => withReact(createEditor()), []);
  const [title, setTitle] = useState(
    initialTitle ? deserializedTitle(initialTitle) : DEFAULT_VALUE
  );
  const [updateDocument] = useMutation(updateDocumentMutation);

  async function handleUpdate() {
    const { data: updateDocumentTitleData } = await updateDocument({
      variables: {
        documentId,
        input: {
          title: title.map(t => Node.string(t)).join('\n'),
        },
      },
      refetchQueries: [
        {
          query: documentQuery,
          variables: { documentId, queryParams: {} },
        },
      ],
    });

    if (updateDocumentTitleData.updateDocument) {
      track('Document title updated', { documentId });
      afterUpdate();
    }
  }

  return (
    <Slate editor={titleEditor} value={title} onChange={v => setTitle(v)}>
      <TitleEditable onBlur={handleUpdate} {...props} />
    </Slate>
  );
};

TitleEditor.propTypes = {
  afterUpdate: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  initialTitle: PropTypes.string,
};

TitleEditor.defaultProps = {
  initialTitle: '',
};

export default TitleEditor;
