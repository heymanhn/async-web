import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import meetingsQuery from 'graphql/meetingsQuery';

import FilterItem from './FilterItem';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey6}`,
  borderRadius: '5px',
  marginTop: '50px',
  marginLeft: '20px',
  paddingTop: '25px',
  position: 'fixed',
  width: '320px',
}));

const FiltersLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '20px',
  marginLeft: '20px',
}));

const DiscussionFeedFilters = ({ onSelectFilter, selectedMeetingId }) => (
  <Container>
    <FiltersLabel>FILTERS</FiltersLabel>
    <Query query={meetingsQuery}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error || !data.meetings) return <div>{error}</div>;

        const { items } = data.meetings;
        const meetings = items.filter(i => i.conversationCount > 0);

        return (
          <React.Fragment>
            <FilterItem
              isSelected={!selectedMeetingId}
              onSelectFilter={onSelectFilter}
            />
            {meetings.map(i => (
              <FilterItem
                key={i.meeting.id}
                isSelected={selectedMeetingId === i.meeting.id}
                meeting={i.meeting}
                onSelectFilter={onSelectFilter}
                unreadCount={i.userUnreadThreadCount}
              />
            ))}
          </React.Fragment>
        );
      }}
    </Query>
  </Container>
);


DiscussionFeedFilters.propTypes = {
  selectedMeetingId: PropTypes.string,
  onSelectFilter: PropTypes.func.isRequired,
};

DiscussionFeedFilters.defaultProps = {
  selectedMeetingId: null,
};

export default DiscussionFeedFilters;
