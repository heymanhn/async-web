import React, { useContext } from 'react';
import styled from '@emotion/styled';

import useDocumentMutations from 'hooks/document/useDocumentMutations';
import { DocumentContext } from 'utils/contexts';

import TitleEditable from 'components/shared/TitleEditable';

const StyledTitleEditable = styled(TitleEditable)(
  ({ theme: { documentViewport } }) => ({
    padding: '0 30px',
    width: documentViewport,
  })
);

const TitleEditor = props => {
  const { handleUpdateDocumentTitle } = useDocumentMutations();
  const { readOnly } = useContext(DocumentContext);

  return (
    <StyledTitleEditable
      readOnly={readOnly}
      handleUpdateTitle={handleUpdateDocumentTitle}
      {...props}
    />
  );
};

export default TitleEditor;
