import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { DEBOUNCE_INTERVAL } from 'utils/constants';
import { debounce } from 'utils/helpers';
import { snakedQueryParams } from 'utils/queryParams';

const DISTANCE_FROM_EDGE = 200;

/*
 * Inspired by https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
 * This is essentially a wrapper on Apollo's useQuery, bundled with
 * custom fetchMore() logic
 *
 * - containerRef: reference to the container that holds the paginated items.
 * - (optional) modalRef: reference to a modal when the results are in a modal.
 * - (optional) reverse: paginate once top of the container is reached
 * - (optional) isDisabled: useful for when the initial set of items hasn't loaded.
 *
 */
const usePaginatedResource = ({
  queryDetails: { query, key, ...props },
  containerRef,
  modalRef,
  reverse = false,
  isDisabled = false,
} = {}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isPaginating, setIsPaginating] = useState(false);
  const { current: container } = containerRef || {};

  const handlePagination = () => {
    if (!container || isDisabled) return;

    const { current: modal } = modalRef || {};
    let bottomEdge;
    let scrollOffset;
    if (modal) {
      bottomEdge = modal.clientHeight;
      scrollOffset = modal.scrollTop;
    } else {
      bottomEdge = window.innerHeight;
      scrollOffset = window.scrollY;
    }

    const totalOffset = reverse ? scrollOffset : bottomEdge + scrollOffset;
    const reachedEdge = reverse
      ? totalOffset <= DISTANCE_FROM_EDGE
      : totalOffset >= container.scrollHeight - DISTANCE_FROM_EDGE;

    if (!reachedEdge || shouldFetch) return;
    setShouldFetch(true);
  };

  useEffect(() => {
    const { current: modal } = modalRef || {};
    if (modalRef && !modal) return () => {};

    const target = modal || window;
    const debouncedPaginate = debounce(handlePagination, DEBOUNCE_INTERVAL);
    target.addEventListener('scroll', debouncedPaginate);

    return () => target.removeEventListener('scroll', debouncedPaginate);
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
          setIsPaginating(false);

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

  if (shouldFetch && pageToken && !isPaginating) {
    setIsPaginating(true);
    fetchMoreItems();
  }

  return { loading, isPaginating, data: data[key] };
};

export default usePaginatedResource;
