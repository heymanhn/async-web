import React, { useContext } from 'react';

import useDocumentMutations from 'utils/hooks/useDocumentMutations';
import { DocumentContext } from 'utils/contexts';

import TitleEditable from 'components/shared/TitleEditable';

const TitleComposer = props => {
  const { handleUpdateTitle } = useDocumentMutations();
  const { readOnly } = useContext(DocumentContext);

  return (
    <TitleEditable
      readOnly={readOnly}
      handleUpdateTitle={handleUpdateTitle}
      {...props}
    />
  );
};

export default TitleComposer;
