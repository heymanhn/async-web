import React from 'react';
import PropTypes from 'prop-types';
import { faCommentPlus } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import InlineDiscussion from 'components/document/InlineDiscussion';
import { RenderInline, RenderMark } from './helpers';

export const INLINE_DISCUSSION_ANNOTATION = 'inline-discussion';
export const CONTEXT_HIGHLIGHT = 'context-highlight';

/* **** Toolbar button **** */

export function StartDiscussionButton({ documentId, editor, handleShowDiscussion, ...props }) {
  function handleClick() {
    // Next step: Pass the selection range to the modal
    const { selection } = editor.value;

    // Hack, will fix later
    setTimeout(() => handleShowDiscussion(null, selection, editor), 0);

    editor.moveToEnd().blur();
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faCommentPlus} isActive={false} />
    </ToolbarButton>
  );
}

StartDiscussionButton.propTypes = {
  documentId: PropTypes.string.isRequired,
  editor: PropTypes.object.isRequired,
  handleShowDiscussion: PropTypes.func.isRequired,
};

/* **** Slate plugin **** */

export function InlineDiscussionPlugin() {
  /* **** Render methods **** */
  function renderInlineDiscussion(props, editor, mark) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */
    const { handleShowDiscussion } = editor.props;

    function removeHighlight() {
      return editor.withoutSaving(() => editor.removeMark(INLINE_DISCUSSION_ANNOTATION));
    }

    return (
      <InlineDiscussion
        attributes={attributes}
        handleClick={removeHighlight}
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
      <ContextHighlight attributes={attributes}>
        {children}
      </ContextHighlight>
    );
  }

  return [RenderInline(CONTEXT_HIGHLIGHT, renderContextHighlight)];
}
