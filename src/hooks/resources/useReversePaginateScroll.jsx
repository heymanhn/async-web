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
  titleRef,
} = {}) => {
  const [prevContainerHeight, setPrevContainerHeight] = useState(null);
  const [prevMessageCount, setPrevMessageCount] = useState(null);
  const { items } = data || {};
  const safeItems = items || [];
  const messageCount = safeItems.length;

  useEffect(() => {
    const { current: container } = containerRef || {};
    const { current: modal } = modalRef || {};
    const { current: title } = titleRef || {};

    if (container) {
      if (isPaginating && !prevContainerHeight) {
        setPrevContainerHeight(container.scrollHeight);
      }

      if (!isPaginating && messageCount > prevMessageCount) {
        setPrevContainerHeight(null);
        setPrevMessageCount(messageCount);

        /* Extra scrolling is only needed if the window is not scrolled to
         * the very top. The offset is the difference in height of the
         * container element, before vs. after pagination.
         *
         * Be sure to also scroll the extra height of the discussion title
         * or thread topic, if it appears.
         */
        const scrollY = modal ? modal.scrollTop : window.scrollY;
        const target = modal || window;

        if (!scrollY) {
          let scrollOffset = container.scrollHeight - prevContainerHeight;
          if (title) scrollOffset += title.offsetHeight;

          target.scroll({ top: scrollOffset });
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
    titleRef,
  ]);

  if (!prevMessageCount && messageCount) setPrevMessageCount(messageCount);
};

export default useReversePaginateScroll;
