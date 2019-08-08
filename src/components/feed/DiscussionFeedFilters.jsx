/*
 * Experimenting with React Hooks to create stateful function components:
 * https://reactjs.org/docs/hooks-overview.html
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import meetingsQuery from 'graphql/meetingsQuery';

import FilterItem from './FilterItem';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  marginTop: '50px',
  marginLeft: '20px',
  padding: '25px 0',
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
        const meetings = items
          .filter(i => i.conversationCount > 0)
          .map(i => i.meeting);

        return (
          <React.Fragment>
            <FilterItem
              isSelected={!selectedMeetingId}
              onSelectFilter={onSelectFilter}
            />
            {meetings.map(m => (
              <FilterItem
                key={m.id}
                isSelected={selectedMeetingId === m.id}
                meeting={m}
                onSelectFilter={onSelectFilter}
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
