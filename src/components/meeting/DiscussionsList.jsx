import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import DiscussionsListCell from './DiscussionsListCell';

const Container = styled.div(({ theme: { colors } }) => ({
  border: `1px solid ${colors.borderGrey}`,
  marginLeft: '20px',
  marginTop: '15px',
}));

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
