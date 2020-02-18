import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import inboxQuery from 'graphql/queries/inbox';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
import { snakedQueryParams } from 'utils/queryParams';

import InboxRow from './InboxRow';

const Container = styled.div({});

const InboxTable = ({ viewMode }) => {
  const inboxRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(inboxRef);
  const [isFetching, setIsFetching] = useState(false);

  const { userId } = getLocalUser();
  const { loading, error, data, fetchMore } = useQuery(inboxQuery, {
    variables: { id: userId, queryParams: { type: viewMode } },
  });
  if (loading) return null;
  if (error || !data.inbox) return <Container>Error fetching page</Container>;

  const { items, pageToken, totalHits } = data.inbox;

  const fetchMoreItems = () => {
    const newQueryParams = { type: viewMode };
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: inboxQuery,
      variables: {
        id: userId,
        queryParams: snakedQueryParams(newQueryParams),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.inbox;
        const {
          items: newItems,
          pageToken: newToken,
          totalHits: newHits,
        } = fetchMoreResult.inbox;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          inbox: {
            items: [...previousItems, ...newItems],
            pageToken: newToken,
            totalHits: totalHits + newHits,
            __typename: fetchMoreResult.inbox.__typename,
          },
        };
      },
    });
  };

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreItems();
  }

  return (
    <Container ref={inboxRef}>
      {(items || []).map(item => {
        const object = item.document || item.discussion;
        return <InboxRow key={object.id} item={item} />;
      })}
    </Container>
  );
};

InboxTable.propTypes = {
  viewMode: PropTypes.oneOf(['all', 'document', 'discussion']).isRequired,
};

export default InboxTable;
