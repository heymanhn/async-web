import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import HeaderBar from './HeaderBar';

const Container = styled.div({

});

const DiscussionsList = ({ documentId }) => {

  return (
    <>
      <HeaderBar documentId={documentId} />
      <Container>
        Hello
      </Container>
    </>
  );
};

DiscussionsList.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default DiscussionsList;
