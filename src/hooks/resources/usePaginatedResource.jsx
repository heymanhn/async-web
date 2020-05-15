import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { DEBOUNCE_INTERVAL } from 'utils/constants';
import { debounce } from 'utils/helpers';
import { snakedQueryParams } from 'utils/queryParams';

const DISTANCE_FROM_BOTTOM = 200;

/*
 * Inspired by https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
 * This is essentially a wrapper on Apollo's useQuery, bundled with
 * custom fetchMore() logic
 *
 * - containerRef is the reference to the container that holds the paginated results.
 * - (optional) gap is the custom distance from the bottom.
 * - (optional) modalRef is the reference to a modal when the results are in a modal.
 * - (optional) reverse will paginate if the user scrolls near the top of the container
 */
const usePaginatedResource = ({
  queryDetails: { query, key, ...props },
  containerRef,
  modalRef = {},
  gap = DISTANCE_FROM_BOTTOM,
  // reverse = false,
} = {}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = () => {
    const elem = containerRef.current;
    if (!elem) return;

    const { current: modal } = modalRef;
    const scrollOffset = modal
      ? modal.clientHeight + modal.scrollTop
      : window.innerHeight + window.scrollY;

    const reachedBottom = scrollOffset >= elem.scrollHeight - gap;
    if (!reachedBottom || shouldFetch) return;
    setShouldFetch(true);
  };

  useEffect(() => {
    if (modalRef && !modalRef.current) return () => {};

    const target = modalRef ? modalRef.current : window;
    const debouncedScroll = debounce(handleScroll, DEBOUNCE_INTERVAL);
    target.addEventListener('scroll', debouncedScroll);

    return () => target.removeEventListener('scroll', debouncedScroll);
  });

  const { loading, data, fetchMore } = useQuery(query, props);
  if (loading || !data || !data[key]) return { loading, data: null };

  const { pageToken } = data[key];
  const { variables } = props;

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
