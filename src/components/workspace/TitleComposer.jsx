import React from 'react';

import useWorkspaceMutations from 'hooks/workspace/useWorkspaceMutations';

import TitleEditable from 'components/shared/TitleEditable';

const TitleComposer = props => {
  const { handleUpdateWorkspaceTitle } = useWorkspaceMutations();

  return (
    <TitleEditable handleUpdateTitle={handleUpdateWorkspaceTitle} {...props} />
  );
};

export default TitleComposer;
