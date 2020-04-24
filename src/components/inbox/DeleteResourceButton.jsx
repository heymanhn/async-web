/* eslint no-alert: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import useDocumentMutations from 'hooks/document/useDocumentMutations';

const resourceProperties = {
  document: {
    useMutations: useDocumentMutations,
  },
  discussion: {
    useMutations: useDiscussionMutations,
  },
};

const Container = styled.div(({ hover, theme: { colors } }) => ({
  display: hover ? 'block' : 'none',
  alignSelf: 'center',
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  marginRight: '20px',
  padding: '1px 6px',

  ':hover': {
    background: colors.bgGrey,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '14px',
}));

const DeleteResourceButton = ({ resourceType, ...props }) => {
  const { useMutations } = resourceProperties[resourceType];
  const { handleDeleteDocument, handleDeleteDiscussion } = useMutations();
  const handleDelete = handleDeleteDocument || handleDeleteDiscussion;

  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();

    const userChoice = window.confirm(
      `Are you sure you want to delete this ${resourceType}?`
    );

    if (!userChoice) return;
    handleDelete();
  };

  return (
    <Container onClick={handleClick} {...props}>
      <StyledIcon icon="trash" />
    </Container>
  );
};

DeleteResourceButton.propTypes = {
  resourceType: PropTypes.string.isRequired,
};

export default DeleteResourceButton;
