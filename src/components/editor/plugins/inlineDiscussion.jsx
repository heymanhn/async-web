import React from 'react';
import styled from '@emotion/styled';

import InlineDiscussion from 'components/discussion/InlineDiscussion';
import { RenderInline, RenderMark } from './helpers';

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

const ContextHighlight = styled.span(({ theme: { colors } }) => ({
  background: colors.highlightYellow,
  padding: '2px 0px',
}));

export function ContextHighlightPlugin() {
  function renderContextHighlight(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return (
      <ContextHighlight attributes={attributes}>{children}</ContextHighlight>
    );
  }

  return [RenderInline(CONTEXT_HIGHLIGHT, renderContextHighlight)];
}
