import { useEffect, useState } from 'react';

/* Keeps the scroll position of the container intact while reverse paginating
 * https://kirbysayshi.com/2013/08/19/maintaining-scroll-position-knockoutjs-list.html
 *
 * Similar to usePaginatedResource(), if a modal ref is passed, it's used as the target
 * for scrolling and calculating scroll offset.
 */
const useReversePaginateScroll = ({
  isPaginating,
  data,
  containerRef,
  modalRef,
} = {}) => {
  const [prevContainerHeight, setPrevContainerHeight] = useState(null);
  const [prevMessageCount, setPrevMessageCount] = useState(null);
  const { items } = data || {};
  const safeItems = items || [];
  const messageCount = safeItems.length;

  useEffect(() => {
    const { current: container } = containerRef || {};
    const { current: modal } = modalRef || {};

    if (container) {
      if (isPaginating && !prevContainerHeight) {
        setPrevContainerHeight(container.scrollHeight);
      }

      if (!isPaginating && messageCount > prevMessageCount) {
        setPrevContainerHeight(null);
        setPrevMessageCount(messageCount);

        // Extra scrolling is only needed if the window is not scrolled to
        // the very top. The offset is the difference in height of the
        // container element, before vs. after pagination.
        const scrollOffset = modal ? modal.scrollTop : window.scrollY;
        const target = modal || window;
        if (!scrollOffset) {
          console.log(
            `scrolling by ${container.scrollHeight - prevContainerHeight}`
          );
          target.scroll({
            top: container.scrollHeight - prevContainerHeight,
          });
        }
      }
    }
  }, [
    isPaginating,
    messageCount,
    prevContainerHeight,
    prevMessageCount,
    containerRef,
    modalRef,
  ]);

  if (!prevMessageCount && messageCount) setPrevMessageCount(messageCount);
};

export default useReversePaginateScroll;
