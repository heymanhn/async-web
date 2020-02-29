import React from 'react';

import useDocumentMutations from 'utils/hooks/useDocumentMutations';

import TitleEditable from 'components/shared/TitleEditable';

const TitleComposer = props => {
  const { handleUpdateTitle } = useDocumentMutations();

  return <TitleEditable handleUpdateTitle={handleUpdateTitle} {...props} />;
};

export default TitleComposer;
