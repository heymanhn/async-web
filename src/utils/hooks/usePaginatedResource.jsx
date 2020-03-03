import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';

import { snakedQueryParams } from 'utils/queryParams';
import { debounce } from 'utils/helpers';
import { DiscussionContext } from 'utils/contexts';

const DEBOUNCE_INTERVAL = 500;

/*
 * Inspired by https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
 *
 * Note:
 * - Not using IntersectionObserver yet due to browser support limitations
 * - Requires a reference to the component being scrolled
 *
 * Now this is essentially a wrapper on Apollo's useQuery, bundled with
 * custom fetchMore() logic
 */
const usePaginatedResource = (ref, { query, key, variables }) => {
  const { modalRef } = useContext(DiscussionContext);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = () => {
    const elem = ref.current;
    if (!elem) return;

    // Subtracting 200px to trigger the fetching action sooner.
    const { current: modal } = modalRef;
    const scrollOffset = modal
      ? modal.scrollHeight
      : window.clientHeight + window.scrollY;

    const reachedBottom = scrollOffset >= elem.offsetHeight - 200;

    if (!reachedBottom || shouldFetch) return;
    setShouldFetch(true);
  };

  useEffect(() => {
    const { current: modal } = modalRef;
    const target = modal || window;
    target.addEventListener(
      'scroll',
      debounce(handleScroll, DEBOUNCE_INTERVAL)
    );

    return () =>
      target.removeEventListener(
        'scroll',
        debounce(handleScroll, DEBOUNCE_INTERVAL)
      );
  });

  const { loading, data, fetchMore } = useQuery(query, { variables });
  if (loading || !data || !data[key]) return { loading, data: null };

  const { pageToken } = data[key];

  const fetchMoreItems = async () => {
    const newQueryParams = variables.queryParams;
    if (pageToken) newQueryParams.pageToken = pageToken;

    try {
      await fetchMore({
        query,
        variables: {
          ...variables,
          queryParams: snakedQueryParams(newQueryParams),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const { items: previousItems } = previousResult[key];
          const { items: newItems, pageToken: newToken } = fetchMoreResult[key];
          setShouldFetch(false);
          setIsFetching(false);

          const newResult = {};
          newResult[key] = {
            ...fetchMoreResult[key],
            pageToken: newToken,
            items: [...previousItems, ...newItems],
          };

          return newResult;
        },
      });
    } catch (error) {
      // See https://github.com/apollographql/apollo-client/issues/4114
      if (error.name !== 'Invariant Violation') throw error;
    }
  };

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreItems();
  }

  return { loading, data: data[key] };
};

export default usePaginatedResource;
