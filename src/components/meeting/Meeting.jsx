import React from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';

import PageContainer from 'components/shared/PageContainer';

const MeetingTitle = styled.div(({ theme: { colors } }) => ({
  fontSize: '36px',
  fontWeight: 600,
  color: colors.mainText,
  marginBottom: '40px',
}));

const Meeting = ({ id }) => (
  <Query query={meetingQuery} variables={{ id }}>
    {({ data, loading, error }) => {
      if (loading) return null;
      if (error || !data.meeting) return null;

      const { title } = data.meeting;
      return (
        <PageContainer isDocument>
          <MeetingTitle>{title}</MeetingTitle>
        </PageContainer>
      );
    }}
  </Query>
);

Meeting.propTypes = { id: PropTypes.string.isRequired };

export default withApollo(withPageTracking(Meeting, 'Meeting'));
