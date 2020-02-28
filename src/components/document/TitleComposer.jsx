import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import { track } from 'utils/analytics';
import { DocumentContext } from 'utils/contexts';
import useContentState from 'utils/hooks/useContentState';

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
 * SLATE UPGRADE TODO:
 * - any pasted text is converted to one line of plain text before it's saved
 *   to the title
 * - Pressing Enter changes focus to the beginning of the content
 */

const TitleComposer = ({ afterUpdate, initialTitle, ...props }) => {
  const { documentId } = useContext(DocumentContext);
  const titleEditor = useMemo(() => withReact(createEditor()), []);
  const { content: title, ...contentProps } = useContentState(initialTitle, {
    isJSON: false,
  });
  const [updateDocument] = useMutation(updateDocumentMutation);

  async function handleUpdate() {
    const { data: updateDocumentTitleData } = await updateDocument({
      variables: { documentId, input: { title } },
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
    <Slate editor={titleEditor} {...contentProps}>
      <TitleEditable
        onBlur={handleUpdate}
        placeholder="Untitled Document"
        {...props}
      />
    </Slate>
  );
};

TitleComposer.propTypes = {
  afterUpdate: PropTypes.func.isRequired,
  initialTitle: PropTypes.string,
};

TitleComposer.defaultProps = {
  initialTitle: '',
};

export default TitleComposer;
