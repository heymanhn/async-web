import React from 'react';

import InlineDiscussion from 'components/discussion/InlineDiscussion';
import { RenderMark } from './helpers';

export const INLINE_DISCUSSION_ANNOTATION = 'inline-discussion';
export const CONTEXT_HIGHLIGHT = 'context-highlight';

/* **** Slate plugin **** */

export function InlineDiscussionPlugin() {
  /* **** Render methods **** */
  function renderInlineDiscussion(props, editor, mark) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    const { handleShowDiscussion } = editor.props;

    return (
      <InlineDiscussion
        attributes={attributes}
        handleShowDiscussion={handleShowDiscussion}
        markData={mark.data}
      >
        {children}
      </InlineDiscussion>
    );
  }

  return [RenderMark(INLINE_DISCUSSION_ANNOTATION, renderInlineDiscussion)];
}
