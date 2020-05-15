import React from 'react';
import styled from '@emotion/styled';

import useWorkspaceMutations from 'hooks/workspace/useWorkspaceMutations';

import TitleEditable from 'components/shared/TitleEditable';
import AddResourceButton from './AddResourceButton';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',

  marginTop: '60px',
});

const StyledTitleEditable = styled(TitleEditable)(
  ({ theme: { workspaceViewport } }) => ({
    marginTop: 0,
    width: workspaceViewport,
  })
);

const StyledAddResourceButton = styled(AddResourceButton)({
  flexShrink: 0,
  marginTop: '10px',
  marginRight: '30px',
});

const TitleEditor = props => {
  const { handleUpdateWorkspaceTitle } = useWorkspaceMutations();

  return (
    <Container>
      <StyledTitleEditable
        handleUpdateTitle={handleUpdateWorkspaceTitle}
        {...props}
      />
      <StyledAddResourceButton />
    </Container>
  );
};

export default TitleEditor;
