import { RenderEditor } from './helpers';

const MINIMUM_DISTANCE_FROM_BOTTOM = 60;

function AutoScroll() {
  function updateWindowPosition() {
    const native = window.getSelection();
    if (native && native.rangeCount === 0) return;

    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const distanceFromBottom = window.innerHeight - rect.bottom;

    if (distanceFromBottom < MINIMUM_DISTANCE_FROM_BOTTOM) {
      const scrollDistance = MINIMUM_DISTANCE_FROM_BOTTOM - distanceFromBottom;
      window.scroll({ top: window.scrollY + scrollDistance });
    }
  }

  function autoScrollDetection(props, editor, next) {
    const children = next();
    const { value } = editor;
    const { selection } = value;

    if (selection.isBlurred) return children;

    setTimeout(updateWindowPosition, 0);

    return children;
  }

  return RenderEditor(autoScrollDetection);
}

export default AutoScroll;