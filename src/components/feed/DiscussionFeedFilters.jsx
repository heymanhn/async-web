/* eslint no-underscore-dangle: 0 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import meetingsQuery from 'graphql/meetingsQuery';
import { snakedQueryParams } from 'utils/queryParams';
import useInfiniteScroll from 'utils/useInfiniteScroll';

import FilterItem from './FilterItem';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey6}`,
  borderRadius: '5px',
  marginBottom: '50px',
  marginLeft: '20px',
  paddingTop: '25px',
  width: '320px',
}));

const FiltersLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '20px',
  marginLeft: '20px',
}));

const DiscussionFeedFilters = ({ onSelectFilter, selectedMeetingId }) => {
  const listRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(listRef);

  const { loading, error, data, fetchMore } = useQuery(meetingsQuery, {
    variables: { queryParams: { size: 25 } },
  });

  if (loading) return null;
  if (error || !data.meetings) return <div>{error}</div>;

  const { items, pageToken } = data.meetings;
  const meetings = items.filter(i => i.conversationCount > 0);

  function fetchMoreFilterItems() {
    fetchMore({
      query: meetingsQuery,
      variables: { queryParams: snakedQueryParams({ pageToken, size: 25 }) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.meetings;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.meetings;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          meetings: {
            pageToken: newToken,
            items: [...previousItems, ...newItems],
            __typename: previousResult.meetings.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreFilterItems();
  }

  return (
    <Container ref={listRef}>
      <FiltersLabel>FILTERS</FiltersLabel>
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
    </Container>
  );
};

DiscussionFeedFilters.propTypes = {
  selectedMeetingId: PropTypes.string,
  onSelectFilter: PropTypes.func.isRequired,
};

DiscussionFeedFilters.defaultProps = {
  selectedMeetingId: null,
};

export default DiscussionFeedFilters;
