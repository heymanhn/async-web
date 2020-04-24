import React, { useContext } from 'react';

import useDocumentMutations from 'hooks/document/useDocumentMutations';
import { DocumentContext } from 'utils/contexts';

import TitleEditable from 'components/shared/TitleEditable';

const TitleEditor = props => {
  const { handleUpdateDocumentTitle } = useDocumentMutations();
  const { readOnly } = useContext(DocumentContext);

  return (
    <TitleEditable
      readOnly={readOnly}
      handleUpdateTitle={handleUpdateDocumentTitle}
      {...props}
    />
  );
};

export default TitleEditor;
