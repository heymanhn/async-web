// Inspired by https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
import { useCallback, useEffect, useState } from 'react';

// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  let timeout;
  return function debounceWrapper(...args) {
    const context = this;
    function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Not using IntersectionObserver yet due to browser support limitations
const useInfiniteScroll = (ref) => {
  const [shouldFetch, setShouldFetch] = useState(false);

  const handleScroll = useCallback(() => {
    const elem = ref.current;

    // Subtracting 200px from the offsetHeight to trigger the fetching action sooner.
    const reachedBottom = window.innerHeight + window.scrollY >= (elem.offsetHeight - 200);
    if (!reachedBottom || shouldFetch) return;
    setShouldFetch(true);
  }, [shouldFetch, ref]);

  useEffect(() => {
    window.addEventListener('scroll', debounce(handleScroll, 500));
    return () => window.removeEventListener('scroll', debounce(handleScroll, 500));
  }, [handleScroll]);

  return [shouldFetch, setShouldFetch];
};

export default useInfiniteScroll;
