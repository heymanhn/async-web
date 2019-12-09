import React from 'react';
import PropTypes from 'prop-types';
import { faCommentPlus } from '@fortawesome/pro-solid-svg-icons';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import InlineDiscussion from 'components/document/InlineDiscussion';
import { RenderMark } from './helpers';

const INLINE_DISCUSSION_ANNOTATION = 'inline-discussion';

/* **** Toolbar button **** */

export function StartDiscussionButton({ documentId, editor, handleShowDiscussion, ...props }) {
  function handleClick() {
    // Next step: Pass the selection range to the modal
    editor.moveToEnd();

    // Hack, will fix later
    setTimeout(handleShowDiscussion, 0);
    // return editor.withoutSaving(() => editor.addMark(INLINE_DISCUSSION_ANNOTATION));
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
  function renderInlineDiscussion(props, editor) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    function removeHighlight() {
      return editor.withoutSaving(() => editor.removeMark(INLINE_DISCUSSION_ANNOTATION));
    }

    return (
      <InlineDiscussion attributes={attributes} handleClick={removeHighlight}>
        {children}
      </InlineDiscussion>
    );
  }

  return [RenderMark(INLINE_DISCUSSION_ANNOTATION, renderInlineDiscussion)];
}
