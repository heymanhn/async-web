import React from 'react';
import PropTypes from 'prop-types';
import { faCommentPlus } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import { RenderAnnotation } from './helpers';

const INLINE_DISCUSSION_ANNOTATION = 'inline-discussion';

/* **** Toolbar button **** */

export function StartDiscussionButton({ editor, ...props }) {
  function handleClick() {
    const { value } = editor;
    const { selection } = value;
    const { anchor, focus } = selection;

    const randomNumber = Math.floor(Math.random() * Math.floor(100000)); // Temporary
    return editor.addAnnotation({
      key: `${INLINE_DISCUSSION_ANNOTATION}-${randomNumber}`,
      type: INLINE_DISCUSSION_ANNOTATION,
      anchor,
      focus,
    });
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
  padding: '2px 5px',
}));

export function InlineDiscussion() {
  /* **** Render methods **** */

  function renderInlineDiscussion(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return <Highlight {...attributes}>{children}</Highlight>;
  }

  return [RenderAnnotation(INLINE_DISCUSSION_ANNOTATION, renderInlineDiscussion)];
}
