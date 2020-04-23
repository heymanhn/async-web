import React from 'react';

import useWorkspaceMutations from 'hooks/workspace/useWorkspaceMutations';

import TitleEditable from 'components/shared/TitleEditable';

const TitleComposer = props => {
  const { handleUpdateTitle } = useWorkspaceMutations();

  return <TitleEditable handleUpdateTitle={handleUpdateTitle} {...props} />;
};

export default TitleComposer;
