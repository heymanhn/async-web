import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

import meetingQuery from 'graphql/meetingQuery';

import Layout from 'components/Layout';

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

      return (
        <Layout mode="wide" title={title}>
          <div>hello</div>
        </Layout>
      );
    }}
  </Query>
);

MeetingSpace.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MeetingSpace;
