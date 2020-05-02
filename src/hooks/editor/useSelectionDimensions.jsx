/*
 * Returns the x and y coordinates of the top left point of the current editor
 * selection, along with the height and width of the selection range,
 * if expanded.
 *
 * Requires:
 * - the hook to be instantiated in a component that is a child of the <Slate />
 *   provider component
 * - ThreadContext provided with a reference to the modal component, if
 *   a modal is currently displayed
 * - DiscussionContext provided with a reference to the composer, if
 *   a discussion is currently displayed
 */
import { useContext, useEffect, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import throttle from 'lodash/throttle';

import { THROTTLE_INTERVAL } from 'utils/constants';
import { DiscussionContext, ThreadContext } from 'utils/contexts';
import Editor from 'components/editor/Editor';

const useSelectionDimensions = ({ skip, source = 'selection' } = {}) => {
  const { modalRef } = useContext(ThreadContext);

  // We only need to use the reference to the composer in the case of a
  // discussion page.
  const { composerRef: containerRef } = useContext(DiscussionContext);

  const [data, setData] = useState({});
  const editor = useSlate();

  // Gets the bounding rectangle for either the current selection, or the
  // parent block of the current selection
  const rectForSource = () => {
    switch (source) {
      // Assumes only one child in the editor: the first content node
      case 'notFocused': {
        const { children } = editor;
        const node = children[0];
        const element = ReactEditor.toDOMNode(editor, node);
        return element.getBoundingClientRect();
      }

      case 'block': {
        const [block] = Editor.getParentBlock(editor);
        const element = ReactEditor.toDOMNode(editor, block);
        return element.getBoundingClientRect();
      }

      case 'DOMSelection': {
        const selection = window.getSelection();
        const domRange = selection.getRangeAt(0);
        return domRange.getBoundingClientRect();
      }

      default: {
        const { selection } = editor;
        const domRange = ReactEditor.toDOMRange(editor, selection);
        return domRange.getBoundingClientRect();
      }
    }
  };

  const calculateDimensions = throttle(() => {
    const { selection } = editor;
    const domSelection = window.getSelection();

    if (!selection && !domSelection && source !== 'notFocused') return;
    if (!domSelection.rangeCount) return;
    if (skip) return;

    const rect = rectForSource();
    const { height, width } = rect;
    let yOffset = window.pageYOffset;
    let xOffset = window.pageXOffset;

    // When a modal is visible, the window isn't scrolled, only the modal component.
    const { current: modal } = modalRef;
    if (modal) {
      yOffset = modal.scrollTop;
      xOffset = modal.scrollLeft;
    }

    /*
     * If a container ref is provided, assume it's a ref to a fixed position element,
     * and update offsets to be based on the element's offset parameters
     *
     * Not my proudest moment, but we shouldn't use the container ref, even if it was
     * provided, if the consumer of this hook is the read only message toolbar
     */
    const { current: container } = containerRef;
    if (container && source !== 'DOMSelection') {
      yOffset = -(window.innerHeight - container.offsetHeight);
      xOffset = -container.offsetLeft;
    }

    const coords = {
      top: rect.top + yOffset,
      left: rect.left + xOffset,
    };

    const dimensions = {
      height,
      width,
    };

    const { coords: oldCoords, dimensions: oldDimensions } = data;
    if (
      oldCoords &&
      oldDimensions &&
      oldCoords.top === coords.top &&
      oldCoords.left === coords.left &&
      oldDimensions.height === dimensions.height &&
      oldDimensions.width === dimensions.width
    )
      return;

    setData({ coords, dimensions, rect });
  }, THROTTLE_INTERVAL);

  useEffect(() => {
    calculateDimensions();

    if (source === 'DOMSelection') {
      window.document.addEventListener('selectionchange', calculateDimensions);
    }

    window.addEventListener('resize', calculateDimensions);

    return () => {
      if (source === 'DOMSelection') {
        window.document.removeEventListener(
          'selectionchange',
          calculateDimensions
        );
      }

      window.removeEventListener('resize', calculateDimensions);
    };
  }, [calculateDimensions, source]);

  return data;
};

export default useSelectionDimensions;
