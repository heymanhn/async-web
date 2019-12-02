import React from 'react';
import PropTypes from 'prop-types';
import { faCommentPlus } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import { RenderMark } from './helpers';

const INLINE_DISCUSSION_ANNOTATION = 'inline-discussion';

/* **** Toolbar button **** */

export function StartDiscussionButton({ editor, ...props }) {
  function handleClick() {
    return editor.addMark(INLINE_DISCUSSION_ANNOTATION);
  }

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon={faCommentPlus} isActive={false} />
    </ToolbarButton>
  );
}

StartDiscussionButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Slate plugin **** */

const Highlight = styled.span(({ theme: { colors } }) => ({
  background: colors.highlightYellow,
  cursor: 'pointer',
  padding: '2px 5px',
}));

export function InlineDiscussion() {
  /* **** Render methods **** */
  function renderInlineDiscussion(props, editor) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    function removeHighlight() {
      console.log('hi');
      return editor.removeMark(INLINE_DISCUSSION_ANNOTATION);
    }

    return <Highlight {...attributes} onClick={removeHighlight}>{children}</Highlight>;
  }

  return [RenderMark(INLINE_DISCUSSION_ANNOTATION, renderInlineDiscussion)];
}
