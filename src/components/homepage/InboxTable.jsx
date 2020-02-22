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

  const { items, pageToken } = data.inbox;

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
        const { items: newItems, pageToken: newToken } = fetchMoreResult.inbox;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          inbox: {
            items: [...previousItems, ...newItems],
            pageToken: newToken,
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

  const compare = (a, b) => {
    const objectA = a.document || a.discussion;
    const objectB = b.document || b.discussion;
    const { updatedAt: t1 } = objectA;
    const { updatedAt: t2 } = objectB;

    if (t1 < t2) {
      return 1;
    }
    if (t1 > t2) {
      return -1;
    }

    return 0;
  };

  return (
    <Container ref={inboxRef}>
      {(items || []).sort(compare).map(item => {
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
