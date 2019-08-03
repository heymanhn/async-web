import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DiscussionsListCell from './DiscussionsListCell';

const Container = styled.div({
  paddingLeft: '20px',
  paddingTop: '15px',
});

const DiscussionsList = ({ conversationIds, meetingId }) => (
  <Container>
    {conversationIds.map(cid => (
      <DiscussionsListCell
        key={cid}
        conversationId={cid}
        meetingId={meetingId}
      />
    ))}
  </Container>
);

DiscussionsList.propTypes = {
  conversationIds: PropTypes.array.isRequired,
  meetingId: PropTypes.string.isRequired,
};

export default DiscussionsList;
