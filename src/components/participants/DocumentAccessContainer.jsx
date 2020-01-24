import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DocumentAccessModal from './DocumentAccessModal';

const ShareButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.grey3}`,
  borderRadius: '5px',
  color: colors.grey1,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  height: '28px',
  padding: '0 15px',
}));

const DocumentAccessContainer = ({ documentId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ShareButton onClick={() => setIsModalOpen(true)}>
        Share
      </ShareButton>
      <DocumentAccessModal
        documentId={documentId}
        handleClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </>
  );
};

DocumentAccessContainer.propTypes = { documentId: PropTypes.string.isRequired };

export default DocumentAccessContainer;
