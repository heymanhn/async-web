/*
 * Not using Slate editor here since we assume we only have access to the
 * contents array
 */

import { DEFAULT_ELEMENT_TYPE } from './constants';

// Assumes a paragraph node always has text children
const isEmptyParagraphNode = ({ type, children }) => {
  const [first] = children;
  return (
    type === DEFAULT_ELEMENT_TYPE &&
    first.text.trim() === '' &&
    children.length === 1
  );
};

// Check for whitespace from both ends of the content array. Stop once there's
// actual content
const trimContent = content => {
  let beginIndex = 0;
  while (beginIndex < content.length) {
    const node = content[beginIndex];
    if (!isEmptyParagraphNode(node)) break;
    beginIndex += 1;
  }

  let endIndex = content.length - 1;
  while (endIndex >= 0) {
    const node = content[endIndex];
    if (!isEmptyParagraphNode(node)) break;
    endIndex -= 1;
  }

  // Avoids an expensive Array.slice() operation if it's unnecessary
  if (beginIndex === 0 && endIndex === content.length - 1) return content;

  return content.slice(beginIndex, endIndex + 1);
};

export default trimContent;
