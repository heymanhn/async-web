import React from 'react';
import styled from '@emotion/styled';

import useWorkspaceMutations from 'hooks/workspace/useWorkspaceMutations';

import TitleEditable from 'components/shared/TitleEditable';

const StyledTitleEditable = styled(TitleEditable)(
  ({ theme: { workspaceViewport } }) => ({
    width: workspaceViewport,
  })
);
const TitleEditor = props => {
  const { handleUpdateWorkspaceTitle } = useWorkspaceMutations();

  return (
    <StyledTitleEditable
      handleUpdateTitle={handleUpdateWorkspaceTitle}
      {...props}
    />
  );
};

export default TitleEditor;
