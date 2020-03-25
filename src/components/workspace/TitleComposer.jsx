import React from 'react';

import useWorkspaceMutations from 'utils/hooks/useWorkspaceMutations';

import TitleEditable from 'components/shared/TitleEditable';

const TitleComposer = props => {
  const { handleUpdateTitle } = useWorkspaceMutations();

  return <TitleEditable handleUpdateTitle={handleUpdateTitle} {...props} />;
};

export default TitleComposer;
