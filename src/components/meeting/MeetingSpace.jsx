import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';

import Layout from 'components/Layout';
import DiscussionThread from './DiscussionThread';

const StyledDiscussionThread = styled(DiscussionThread)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  margin: '30px 20px',
  maxWidth: '700px',
  width: '700px',
}));

const MeetingSpace = ({ id }) => (
  <Query
    query={meetingQuery}
    variables={{ id }}
  >
    {({ loading, error, data }) => {
      if (loading && !data) return null;
      if (error || !data.meeting) return <div>{error}</div>;

      const { author, body, conversations, deadline, participants, title } = data.meeting;
      const conversationIds = (conversations || []).map(c => c.id);

      const selectedConversation = conversations[0];

      return (
        <Layout mode="wide" title={title}>
          <StyledDiscussionThread
            conversationId={selectedConversation.id}
            meetingId={id}
          />
        </Layout>
      );
    }}
  </Query>
);

MeetingSpace.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MeetingSpace;
